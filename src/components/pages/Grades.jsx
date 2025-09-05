import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeCalculator from "@/components/organisms/GradeCalculator";
import { courseService } from "@/services/api/courseService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data);
      if (data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0]);
      }
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const calculateCourseGrade = (course) => {
    if (!course.gradeCategories || course.gradeCategories.length === 0) return 0;
    
    const weightedSum = course.gradeCategories.reduce((sum, category) => {
      if (!category.grades || category.grades.length === 0) return sum;
      const categoryAvg = category.grades.reduce((total, grade) => total + grade.score, 0) / category.grades.length;
      return sum + (categoryAvg * category.weight / 100);
    }, 0);
    
    return weightedSum;
  };

  const getGradeLetterAndColor = (grade) => {
    if (grade >= 90) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (grade >= 80) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (grade >= 70) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (grade >= 60) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    
    const totalGradePoints = courses.reduce((sum, course) => {
      const grade = calculateCourseGrade(course);
      let points = 0;
      if (grade >= 90) points = 4.0;
      else if (grade >= 80) points = 3.0;
      else if (grade >= 70) points = 2.0;
      else if (grade >= 60) points = 1.0;
      else points = 0.0;
      
      return sum + (points * course.credits);
    }, 0);
    
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const handleUpdateGrades = async (gradeCategories) => {
    if (!selectedCourse) return;
    
    try {
      const updatedCourse = await courseService.updateGrades(selectedCourse.Id, gradeCategories);
      setCourses(prev => 
        prev.map(course => 
          course.Id === selectedCourse.Id ? updatedCourse : course
        )
      );
      setSelectedCourse(updatedCourse);
    } catch (err) {
      toast.error("Failed to update grades");
    }
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadCourses} />;
  }

  if (courses.length === 0) {
    return (
      <Empty
        type="grades"
        title="No courses found"
        message="Add some courses first to start tracking your grades"
        actionText="Add Courses"
        onAction={() => window.location.href = '/courses'}
      />
    );
  }

  const overallGPA = calculateOverallGPA();
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Grades & GPA
          </h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance and calculate your GPA
          </p>
        </div>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {overallGPA.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Overall GPA</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {courses.length}
          </div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {totalCredits}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {Math.round(courses.reduce((sum, course) => sum + calculateCourseGrade(course), 0) / courses.length) || 0}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Select Course
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {courses.map((course) => {
              const grade = calculateCourseGrade(course);
              const gradeInfo = getGradeLetterAndColor(grade);
              
              return (
                <button
                  key={course.Id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedCourse?.Id === course.Id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {course.code}
                        </h3>
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">
                          {course.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${gradeInfo.color} ${gradeInfo.bg}`}>
                        {grade.toFixed(1)}% ({gradeInfo.letter})
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {course.credits} credits
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Grade Calculator */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 font-display">
                    {selectedCourse.code} - Grade Calculator
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedCourse.name} • {selectedCourse.professor}
                  </p>
                </div>
                <div 
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: selectedCourse.color }}
                />
              </div>
              
              <GradeCalculator
                course={selectedCourse}
                onUpdateGrades={handleUpdateGrades}
              />
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <ApperIcon name="Award" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Course
                </h3>
                <p className="text-gray-600">
                  Choose a course from the list to manage grades and calculate your score
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Grade Distribution */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          Grade Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'].map((grade, index) => {
            const ranges = [[90, 100], [80, 89], [70, 79], [60, 69], [0, 59]];
            const [min, max] = ranges[index];
            const count = courses.filter(course => {
              const courseGrade = calculateCourseGrade(course);
              return courseGrade >= min && courseGrade <= max;
            }).length;
            
            const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
            
            return (
              <div key={grade} className="text-center">
                <div className={`${colors[index]} text-white rounded-lg p-4 mb-2`}>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
                <div className="text-sm text-gray-600">{grade}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Grades;