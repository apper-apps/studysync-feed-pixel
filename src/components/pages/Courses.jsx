import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";
import SearchBar from "@/components/molecules/SearchBar";
import { courseService } from "@/services/api/courseService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadCourses = async () => {
try {
      setError("");
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data || []);
      setFilteredCourses(data || []);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;
if (selectedSemester !== "all") {
      filtered = filtered.filter(course => course.semester_c === selectedSemester);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.professor_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCourses(filtered);
  }, [courses, selectedSemester, searchTerm]);

  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      setShowAddModal(false);
      toast.success("Course added successfully!");
    } catch (err) {
      toast.error("Failed to add course");
    }
  };

  const handleCourseClick = (course) => {
    // In a real app, this would navigate to course details
    toast.info(`Opening ${course.code} details`);
  };

  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadCourses} />;
  }

const semesters = [...new Set(courses.map(c => c.semester_c))];
  const semesterFilters = semesters.map(semester => ({
    value: semester,
    label: semester
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            My Courses
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your academic courses and track your progress
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowAddModal(true)}
        >
          Add Course
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search courses, professors..."
          className="flex-1"
        />
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-field w-auto min-w-[150px]"
          >
            <option value="all">All Semesters</option>
{semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {courses.length}
          </div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {courses.reduce((sum, c) => sum + (parseInt(c.credits_c) || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {courses.filter(c => c.semester === "Fall 2024").length}
          </div>
          <div className="text-sm text-gray-600">Current Semester</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.round(courses.reduce((total, course) => {
              const grade = course.gradeCategories?.reduce((sum, category) => {
                const avg = category.grades?.reduce((s, g) => s + g.score, 0) / (category.grades?.length || 1);
                return sum + (avg * category.weight / 100);
              }, 0) || 0;
              return total + grade;
            }, 0) / courses.length) || 0}%
          </div>
          <div className="text-sm text-gray-600">Average Grade</div>
        </Card>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Empty 
          type="courses"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCourse}
      />
    </div>
  );
};

const AddCourseModal = ({ isOpen, onClose, onSubmit }) => {
const [formData, setFormData] = useState({
    Name: "",
    code_c: "",
    professor_c: "",
    credits_c: "",
    color_c: "#8B5CF6",
    semester_c: "Fall 2024"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.professor.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
await onSubmit({
        ...formData,
        credits_c: parseInt(formData.credits_c) || 3,
        grade_categories_c: ""
      });
      setFormData({
        name: "",
        code: "",
        professor: "",
        credits: "",
        color: "#8B5CF6",
        semester: "Fall 2024"
      });
    } catch (error) {
      toast.error("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const semesterOptions = [
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Fall 2025", label: "Fall 2025" },
    { value: "Spring 2025", label: "Spring 2025" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <Card className="relative inline-block w-full max-w-md p-0 my-8 text-left align-middle transition-all transform shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Add New Course
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
<Input
              label="Course Name"
              value={formData.Name}
              onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
              placeholder="Introduction to Computer Science"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course Code"
                value={formData.code_c}
                onChange={(e) => setFormData(prev => ({ ...prev, code_c: e.target.value }))}
                placeholder="CS101"
                required
              />

              <Input
                label="Credits"
                type="number"
                value={formData.credits_c}
                onChange={(e) => setFormData(prev => ({ ...prev, credits_c: e.target.value }))}
                placeholder="3"
                min="1"
                max="6"
                required
              />
            </div>

            <Input
              label="Professor"
              value={formData.professor}
              onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
              placeholder="Dr. Smith"
              required
            />

            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
              options={semesterOptions}
            />

            <CourseColorPicker
              selectedColor={formData.color}
              onColorChange={(color) => setFormData(prev => ({ ...prev, color }))}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Add Course
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Courses;