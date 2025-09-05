import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const CourseCard = ({ course, onClick }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600 bg-green-100";
    if (grade >= 80) return "text-blue-600 bg-blue-100";
    if (grade >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const currentGrade = course.gradeCategories?.reduce((total, category) => {
    const categoryAvg = category.grades?.reduce((sum, grade) => sum + grade.score, 0) / (category.grades?.length || 1);
    return total + (categoryAvg * category.weight / 100);
  }, 0) || 0;

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div 
              className="w-3 h-8 rounded-full mr-3"
              style={{ backgroundColor: course.color }}
            />
            <div>
              <h3 className="font-semibold text-gray-900 font-display">
                {course.code}
              </h3>
              <p className="text-sm text-gray-600">{course.name}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getGradeColor(currentGrade)}`}>
            {currentGrade.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="User" className="w-4 h-4 mr-2" />
          <span>{course.professor}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            <span>{course.semester}</span>
          </div>
          <Badge variant="default" size="sm">
            {course.credits} Credits
          </Badge>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{Math.round(currentGrade)}%</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(currentGrade, 100)}%`,
              background: `linear-gradient(90deg, ${course.color}80, ${course.color})`
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;