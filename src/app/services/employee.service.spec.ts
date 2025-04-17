import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      company: 'Infrrd',
      email: 'john@example.com',
      contact: '9876543210',
      designation: 'Developer',
      avatar: this.getRandomAvatar(),
    },
    // Add more mock data as needed
  ];

  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployee(id: number): Employee | undefined {
    return this.employees.find((e) => e.id === id);
  }

  addEmployee(emp: Employee): void {
    emp.id = this.employees.length + 1;
    emp.avatar = this.getRandomAvatar();
    this.employees.push(emp);
  }

  updateEmployee(updatedEmp: Employee): void {
    const index = this.employees.findIndex((e) => e.id === updatedEmp.id);
    if (index !== -1) this.employees[index] = updatedEmp;
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter((e) => e.id !== id);
  }

  getRandomAvatar(): string {
    const random = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${random}`;
  }
  getAllEmployees(): Employee[] {
    return this.employees;
  }
}
