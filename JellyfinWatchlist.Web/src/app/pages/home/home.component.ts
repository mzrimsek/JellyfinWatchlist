import { Component, OnInit } from '@angular/core';

import { JellyfinService } from '../../services/jellyfin.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  username: string = '';
  constructor(private jellyfinService: JellyfinService) {}

  ngOnInit(): void {
    this.jellyfinService.getCurrentUser().then((user) => {
      this.username = user.Name ?? 'User';
    });
  }
}
