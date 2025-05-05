import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AdminService } from '../../core/servcies/admin.service';
import { Iaccount } from '../../core/interfaces/iaccount';
import { Icomment } from '../../core/interfaces/icomment';
import { startWith } from 'rxjs';
import { ISurvey } from '../../core/interfaces/isurvey';
import { trace } from 'console';

@Component({
  selector: 'app-admin-settings',
  imports: [CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  private readonly _AdminService = inject(AdminService);
  usersList: Iaccount[] = [];
  commentsList: Icomment[] = [];
  surveyList: ISurvey[] = [];

  LockedUsers: object[] = [];
  UnlockedUsers: object[] = [];

  CommentedUsers: number = 0;
  UncommentedUsers: number = 0;

  locked: number = 0;
  unlocked: number = 0;
  totalUsers: number = 0;
  totalSurveys: number = 0;
  totalUsersSentSurvey: number = 0;

  chartOptions2 = {
    animationEnabled: true,
    axisX: {
      title: "User Statuses",
      // maximum: 2,
      // minimum: 0,
      interval: 2,
    },
    axisY: {
      title: "Percentage of Users",
      maximum: 100,
      minimum: 0,
      interval: 10,
      gridColor: "#e0e0e0",
    },
    data: [{
      type: "column", // Changed to vertical bars
      indexLabel: "{name} {y}", // Display percentage next to the bars
      yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 0, name: "Unlocked User", color: "#52a0e9" }, // Initial value, will be updated
        { y: 0, name: "Locked Users", color: "#52a0e9" },    // Initial value, will be updated
      ]
    }]
  };

  chartOptions = {
    animationEnabled: true,
    height: 350,
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 0, name: "interactive users", color: "#52a0e9"  }, // Initial value, will be updated
        { y: 0, name: "non-interactive users" }    // Initial value, will be updated
      ]
    }]
  };

  chartOptions3 = {
    animationEnabled: true,
    title: null,
    height: 100,
    data: [{
      type: "doughnut", // This makes the chart a donut
      startAngle: 60,
      innerRadius: "70%", // Makes the chart a donut shape
      indexLabel: "{name} {y}%", // Display percentage in the chart
      dataPoints: [
        { y: 90, name: "m" },
        { y: 10, name: "" }
      ]
    }]
  };

  activeIndex: number = 0; // First one open by default

  toggleSection(index: number): void {
    // If clicking the already open section, close it. Otherwise, open the new one.
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }

  commentedUsersCount: number = 0;
  commentedUsersPercentage: number = 0;
  uncommentedUsersPercentage: number = 0;

  ngOnInit(): void {
    this.getSurvey();
    this._AdminService.getAllUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.usersList = res;

        // Segregate users based on their isLockedOut status
        this.LockedUsers = this.usersList.filter(user => user.isLockedOut);
        this.UnlockedUsers = this.usersList.filter(user => !user.isLockedOut);

        // Calculate the total number of users
        this.totalUsers = this.usersList.length;

        // Calculate the percentages of locked and unlocked users
        this.locked = (this.LockedUsers.length / this.totalUsers) * 100; // Percentage of locked users
        this.unlocked = (this.UnlockedUsers.length / this.totalUsers) * 100; // Percentage of unlocked users

        // Update the chart data dynamically
        this.chartOptions2.data[0].dataPoints[0].y = this.unlocked; // Update Unlocked Users percentage
        this.chartOptions2.data[0].dataPoints[1].y = this.locked; // Update Locked Users percentage

        // Trigger chart update by assigning a new reference to the chart options
        setTimeout(() => {
          this.chartOptions2 = { ...this.chartOptions2 }; // Force re-render
        }, 0);

        console.log('Locked Users Percentage:', this.locked);
        console.log('Unlocked Users Percentage:', this.unlocked);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this._AdminService.getAllUsers().subscribe({
      next: (usersRes) => {
        this.usersList = usersRes;
        this.totalUsers = this.usersList.length; // Total number of users

        this._AdminService.getAllComments().subscribe({
          next: (commentsRes) => {
            this.commentsList = commentsRes;

            // Extract unique user IDs who commented
            const uniqueCommenters = new Set(this.commentsList.map(comment => comment.userId));
            this.commentedUsersCount = uniqueCommenters.size; // Number of unique users who commented

            // Calculate percentages
            this.commentedUsersPercentage = (this.commentedUsersCount / this.totalUsers) * 100;
            this.uncommentedUsersPercentage = 100 - this.commentedUsersPercentage;

            // Update the chart data dynamically
            this.chartOptions.data[0].dataPoints[0].y = this.commentedUsersPercentage; // % of users who commented
            this.chartOptions.data[0].dataPoints[1].y = this.uncommentedUsersPercentage; // % of users who didn't comment

            // Trigger chart update
            setTimeout(() => {
              this.chartOptions = { ...this.chartOptions }; // Force re-render
            }, 0);

            console.log('Total Users:', this.totalUsers);
            console.log('Users Who Commented:', this.commentedUsersCount);
            console.log('Commented Users Percentage:', this.commentedUsersPercentage.toFixed(2) + "%");
            console.log('Uncommented Users Percentage:', this.uncommentedUsersPercentage.toFixed(2) + "%");
          },
          error: (err) => console.log('Error fetching comments:', err)
        });
      },
      error: (err) => console.log('Error fetching users:', err)
    });
  }


  getSurvey(): void {
    this._AdminService.getSurvey().subscribe({
      next: (res) => {
        console.log(res);
        this.surveyList = res;

        // Count total surveys
        this.totalSurveys = this.surveyList.length;

        // Count unique users who sent surveys
        const userIds = new Set(this.surveyList.map(survey => survey.applicationUserId));
        this.totalUsersSentSurvey = userIds.size;

        console.log(`Total Surveys: ${this.totalSurveys}`);
        console.log(`Total Users Who Sent Surveys: ${this.totalUsersSentSurvey}`);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}
