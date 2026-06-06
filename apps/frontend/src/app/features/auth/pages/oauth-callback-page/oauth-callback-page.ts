import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback-page',
  imports: [],
  templateUrl: './oauth-callback-page.html',
  styleUrl: './oauth-callback-page.scss',
})
export class OauthCallbackPage implements OnInit{
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        localStorage.setItem('auth_token', token);
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login'], { queryParams: { error: 'oauth_failed' } });
      }
    });
  }
}
