package com.employeeservice.controller;

import com.employeeservice.entity.Employee;
import com.employeeservice.repository.EmployeeRepository;
import com.employeeservice.service.EmployeeService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
	@Autowired
	private EmployeeRepository employeeRepository;

 
    private final EmployeeService employeeService;
    
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
    
    @GetMapping
    public List<Employee> getAllEmployees() {
    	 return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    	Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // STATUS EMPLOYEES
//    @GetMapping("/{id}/status")
//    public String getEmployeeStatus(@PathVariable Long id) {
//        return employeeService.getEmployeeStatus(id);
//    }

   


    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        Optional<Employee> existingEmp = employeeRepository.findById(id);
        if (existingEmp.isEmpty()) return ResponseEntity.notFound().build();

        Employee emp = existingEmp.get();
        emp.setFirstName(employee.getFirstName());
        emp.setLastName(employee.getLastName());
        emp.setEmail(employee.getEmail());
        emp.setDepartment(employee.getDepartment());
        emp.setDesignation(employee.getDesignation());
        emp.setManager(employee.getManager());
        emp.setEmploymentStatus(employee.getEmploymentStatus());
        emp.setJoiningDate(employee.getJoiningDate());
        emp.setPhone(employee.getPhone());
        Employee updatedEmp = employeeRepository.save(emp);
        return ResponseEntity.ok(updatedEmp);
    }
    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {
        // Check if email already exists
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Employee with this email already exists");
        }

        try {
            Employee savedEmp = employeeRepository.save(employee);
            return ResponseEntity.ok(savedEmp);
        } catch (Exception e) {
           e.printStackTrace(); // logs the actual error
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Failed to save employee");}
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
