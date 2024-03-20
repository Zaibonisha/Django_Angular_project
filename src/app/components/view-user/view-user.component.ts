import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/User';
import { UserService } from '../../app.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, private router: Router) { 
   
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUsers(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
          console.log(data);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          // Handle error gracefully, e.g., show error message to the user
        }
      });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('User deleted successfully:', data);
          // Refresh the user list after deletion
          this.fetchUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error gracefully, e.g., show error message to the user
        }
      });
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/edit-user', id]); // Navigate to edit user page
  }

}
