import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";

const GradeCalculator = ({ course, onUpdateGrades }) => {
const [categories, setCategories] = useState(() => {
    let gradeCategories = course?.grade_categories_c || [];
    if (typeof gradeCategories === 'string') {
      try {
        gradeCategories = JSON.parse(gradeCategories);
      } catch (e) {
        gradeCategories = [];
      }
    }
    return gradeCategories;
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryWeight, setNewCategoryWeight] = useState("");

useEffect(() => {
    if (course?.grade_categories_c) {
      let gradeCategories = course.grade_categories_c;
      if (typeof gradeCategories === 'string') {
        try {
          gradeCategories = JSON.parse(gradeCategories);
        } catch (e) {
          gradeCategories = [];
        }
      }
      setCategories(gradeCategories);
    }
  }, [course]);

  const calculateCategoryAverage = (category) => {
    if (!category.grades || category.grades.length === 0) return 0;
    const total = category.grades.reduce((sum, grade) => sum + grade.score, 0);
    return total / category.grades.length;
  };

  const calculateOverallGrade = () => {
    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    if (totalWeight === 0) return 0;
    
    const weightedSum = categories.reduce((sum, category) => {
      const categoryAvg = calculateCategoryAverage(category);
      return sum + (categoryAvg * category.weight / 100);
    }, 0);
    
    return weightedSum;
  };

  const getTotalWeight = () => {
    return categories.reduce((sum, cat) => sum + cat.weight, 0);
  };

  const addCategory = () => {
    if (!newCategoryName.trim() || !newCategoryWeight) {
      toast.error("Please enter category name and weight");
      return;
    }

    const weight = parseFloat(newCategoryWeight);
    if (weight <= 0 || weight > 100) {
      toast.error("Weight must be between 1 and 100");
      return;
    }

    const newCategory = {
      name: newCategoryName.trim(),
      weight: weight,
      grades: []
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    setNewCategoryWeight("");
  };

  const removeCategory = (index) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addGrade = (categoryIndex, score, assignment = "") => {
    if (score < 0 || score > 100) {
      toast.error("Score must be between 0 and 100");
      return;
    }

    setCategories(prev => prev.map((category, index) => {
      if (index === categoryIndex) {
        return {
          ...category,
          grades: [...category.grades, { score, assignment }]
        };
      }
      return category;
    }));
  };

  const removeGrade = (categoryIndex, gradeIndex) => {
    setCategories(prev => prev.map((category, index) => {
      if (index === categoryIndex) {
        return {
          ...category,
          grades: category.grades.filter((_, i) => i !== gradeIndex)
        };
      }
      return category;
    }));
  };

  const saveGrades = () => {
    onUpdateGrades?.(categories);
    toast.success("Grades updated successfully!");
  };

  const overallGrade = calculateOverallGrade();
  const totalWeight = getTotalWeight();

  return (
    <div className="space-y-6">
      {/* Overall Grade Display */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Current Grade
          </h3>
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {overallGrade.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Weight Distribution: {totalWeight}% of 100%
          </div>
          {totalWeight !== 100 && (
            <div className="text-sm text-orange-600 mt-1">
              ⚠️ Weights don't add up to 100%
            </div>
          )}
        </div>
      </Card>

      {/* Add New Category */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add Grade Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Exams, Homework..."
          />
          <Input
            label="Weight (%)"
            type="number"
            value={newCategoryWeight}
            onChange={(e) => setNewCategoryWeight(e.target.value)}
            placeholder="e.g., 30"
            min="1"
            max="100"
          />
          <Button onClick={addCategory} icon="Plus">
            Add Category
          </Button>
        </div>
      </Card>

      {/* Categories */}
      {categories.map((category, categoryIndex) => (
        <CategoryCard
          key={categoryIndex}
          category={category}
          categoryIndex={categoryIndex}
          onAddGrade={addGrade}
          onRemoveGrade={removeGrade}
          onRemoveCategory={() => removeCategory(categoryIndex)}
          average={calculateCategoryAverage(category)}
        />
      ))}

      {categories.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={saveGrades} variant="primary" icon="Save">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({ category, categoryIndex, onAddGrade, onRemoveGrade, onRemoveCategory, average }) => {
  const [newScore, setNewScore] = useState("");
  const [newAssignment, setNewAssignment] = useState("");

  const handleAddGrade = () => {
    if (!newScore) {
      toast.error("Please enter a score");
      return;
    }

    const score = parseFloat(newScore);
    onAddGrade(categoryIndex, score, newAssignment);
    setNewScore("");
    setNewAssignment("");
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600">
            Weight: {category.weight}% | Average: {average.toFixed(1)}%
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={onRemoveCategory}
          className="text-red-500 hover:text-red-700"
        />
      </div>

      {/* Existing Grades */}
      {category.grades.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Grades:</h4>
          {category.grades.map((grade, gradeIndex) => (
            <div key={gradeIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="font-medium">{grade.score}%</span>
                {grade.assignment && (
                  <span className="text-sm text-gray-600 ml-2">
                    - {grade.assignment}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => onRemoveGrade(categoryIndex, gradeIndex)}
                className="text-red-500 hover:text-red-700"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add New Grade */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <Input
          label="Score"
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          placeholder="85"
          min="0"
          max="100"
        />
        <Input
          label="Assignment (Optional)"
          value={newAssignment}
          onChange={(e) => setNewAssignment(e.target.value)}
          placeholder="Midterm Exam"
        />
        <div className="sm:col-span-2">
          <Button onClick={handleAddGrade} icon="Plus" className="w-full">
            Add Grade
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GradeCalculator;