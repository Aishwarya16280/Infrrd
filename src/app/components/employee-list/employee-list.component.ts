import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { filter, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  selectedEmployee: Employee = this.getEmptyEmployee();
  showModal = false;
  routerSubscription!: Subscription;

  constructor(private empService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadEmployees();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadEmployees() {
    this.employees = this.empService.getEmployees();
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.empService.deleteEmployee(id);
      this.loadEmployees();
    }
  }

  openModal(employee?: Employee) {
    this.selectedEmployee = employee ? { ...employee } : this.getEmptyEmployee();
    if (!this.selectedEmployee.id) {
      this.selectedEmployee.avatar = this.generateRandomAvatar();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEmployee = this.getEmptyEmployee();
  }

  saveEmployee() {
    if (this.selectedEmployee.id) {
      this.empService.updateEmployee(this.selectedEmployee);
    } else {
      this.selectedEmployee.id = this.generateNewId();
      this.empService.addEmployee(this.selectedEmployee);
    }

    this.loadEmployees();
    this.closeModal();
  }

  getEmptyEmployee(): Employee {
    return {
      id: 0,
      name: '',
      company: '',
      email: '',
      contact: '',
      designation: '',
      avatar: ''
    };
  }

  generateNewId(): number {
    const maxId = this.employees.length
      ? Math.max(...this.employees.map(emp => emp.id))
      : 0;
    return maxId + 1;
  }

  generateRandomAvatar(): string {
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
  }
}
