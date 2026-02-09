package com.employeeservice.service;

import com.employeeservice.entity.Employee;
import java.util.List;

public interface EmployeeService {

    Employee addEmployee(Employee employee);

    Employee saveEmployee(Employee employee);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

//    String getEmployeeStatus(Long id);

    Employee updateEmployee(Long id, Employee updatedEmp);

    void deleteEmployee(Long id);
    
}
