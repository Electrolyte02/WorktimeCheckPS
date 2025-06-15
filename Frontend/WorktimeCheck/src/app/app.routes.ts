import { Routes } from '@angular/router';
import { EmployeeCreateComponent } from './components/employees/employee-create/employee-create.component';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { AdminConfigurationComponent } from './components/admin/admin-configuration/admin-configuration.component';
import { TimeListComponent } from './components/times/time-list/time-list.component';
import { JustificationFormComponent } from './components/justification/justification-form/justification-form.component';
import { JustificationListComponent } from './components/justification/justification-list/justification-list.component';
import { JustificationViewComponent } from './components/justification/justification-view/justification-view.component';
import { CheckFormComponent } from './components/checks/check-form/check-form.component';
import { CheckListComponent } from './components/checks/check-list/check-list.component';
import { AreaListComponent } from './components/areas/area-list/area-list.component';
import { MyTimeListComponent } from './components/times/my-time-list/my-time-list.component';
import { MyCheckListComponent } from './components/checks/my-check-list/my-check-list.component';
import { MyJustificationListComponent } from './components/justification/my-justification-list/my-justification-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    {
    path: '',
    component: MainLayoutComponent,
    children: [
        { path: 'employeeList', component: EmployeeListComponent },
        { path: "employee", component:EmployeeCreateComponent},
        { path: "employee/:id", component:EmployeeCreateComponent},
        { path: "config", component:AdminConfigurationComponent},
        { path: "users", component: UserListComponent},
        { path: "timeList", component: TimeListComponent},
        { path: "timeList/my", component: MyTimeListComponent},
        { path: "justification/:timeId", component: JustificationFormComponent},
        { path: "justificationList", component: JustificationListComponent},
        { path: "justificationList/my", component: MyJustificationListComponent},
        { path: "justification/view/:id", component: JustificationViewComponent},
        { path: 'check/:justificationId', component: CheckFormComponent},
        { path: 'checks/:employeeId', component: CheckListComponent },
        { path: 'areaList', component:AreaListComponent},
        { path: 'dashboard', component:DashboardComponent},
        { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
