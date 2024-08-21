package com.smartvizz.expenses.backend.web.controllers;

import com.smartvizz.expenses.backend.services.CategoryService;
import com.smartvizz.expenses.backend.web.models.CategoryRequest;
import com.smartvizz.expenses.backend.web.models.CategoryResponse;
import com.smartvizz.expenses.backend.web.models.PageDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:8888", "http://localhost:4200"})
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<CategoryResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "createdAt,title") String[] sortColumns,
            @RequestParam(defaultValue = "asc,asc") String[] sortDirections,
            @RequestParam(defaultValue = "") String searchBy
    ) {
        PageDTO<CategoryResponse> categories = categoryService.fetchAll(page, size, sortColumns, sortDirections, searchBy);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable long id) {
        CategoryResponse category = categoryService.fetchOne(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse createdCategory = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable long id, @Valid @RequestBody CategoryRequest request) {
        CategoryResponse updatedCategory = categoryService.update(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
