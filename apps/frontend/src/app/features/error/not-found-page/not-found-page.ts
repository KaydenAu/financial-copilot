import { Component } from '@angular/core';
import { SharedModules } from '../../../../shared/shared.module';

@Component({
  selector: 'app-not-found-page',
  imports: [...SharedModules],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage { }
