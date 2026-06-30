import { Routes } from '@angular/router';
import { GoalCreatePage } from './pages/goal-create-page/goal-create-page';
import { GoalDetailsPage } from './pages/goal-details-page/goal-details-page';
import { GoalEditPage } from './pages/goal-edit-page/goal-edit-page';
import { GoalListPage } from './pages/goal-list-page/goal-list-page';

export const SAVINGS_GOALS_ROUTES: Routes = [
    { path: '', component: GoalListPage },
    { path: 'create', component: GoalCreatePage },
    { path: ':id', component: GoalDetailsPage },
    { path: ':id/edit', component: GoalEditPage },
];
