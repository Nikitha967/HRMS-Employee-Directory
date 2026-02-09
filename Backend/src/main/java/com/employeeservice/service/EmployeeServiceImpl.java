package com.employeeservice.service;

import com.employeeservice.entity.Employee;
import com.employeeservice.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee addEmployee(Employee employee) {

        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new RuntimeException("Employee already exists with this email");
        }

        if (employeeRepository.findByEmployeeCode(employee.getEmployeeCode()).isPresent()) {
            throw new RuntimeException("Employee already exists with this employee code");
        }

        return employeeRepository.save(employee);
    }



    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

//    @Override
//    public String getEmployeeStatus(Long id) {
//        Employee emp = employeeRepository.findById(id).orElse(null);
//        return emp != null ? emp.getEmploymentStatus() : null;
//    }

    @Override
    public Employee updateEmployee(Long id, Employee updatedEmp) {
        Employee emp = employeeRepository.findById(id).orElse(null);
        if (emp == null) return null;

        emp.setFirstName(updatedEmp.getFirstName());
        emp.setLastName(updatedEmp.getLastName());
        emp.setEmail(updatedEmp.getEmail());
        emp.setDepartment(updatedEmp.getDepartment());
        emp.setDesignation(updatedEmp.getDesignation());
        emp.setManager(updatedEmp.getManager());
        emp.setPhone(updatedEmp.getPhone());
        emp.setEmploymentStatus(updatedEmp.getEmploymentStatus());

        return employeeRepository.save(emp);
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
