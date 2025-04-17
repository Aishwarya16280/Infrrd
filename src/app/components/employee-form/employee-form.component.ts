import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    name: '',
    company: '',
    email: '',
    contact: '',
    designation: '',
    avatar: ''
  };

  constructor(
    private empService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;
    if (id) {
      const existingEmployee = this.empService.getEmployee(id);
      if (existingEmployee) {
        this.employee = { ...existingEmployee };
      } else {
        alert('Employee not found');
        this.router.navigate(['/']);
      }
    }
  }

  saveEmployee(): void {
    if (this.employee.id) {
      this.empService.updateEmployee(this.employee);
    } else {
      this.employee.id = this.generateNewId();
      this.employee.avatar = this.generateRandomAvatar(); 
      this.empService.addEmployee(this.employee);
    }
    this.router.navigate(['/']);
  }

  generateNewId(): number {
    const employees = this.empService.getAllEmployees();
    const maxId = employees.length ? Math.max(...employees.map(e => e.id)) : 0;
    return maxId + 1;
  }

  generateRandomAvatar(): string {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=${randomSeed}`;
  }
}
