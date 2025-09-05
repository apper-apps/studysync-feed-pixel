import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = this.courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  }

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const highestId = Math.max(...this.courses.map(c => c.Id), 0);
    const newCourse = {
      Id: highestId + 1,
      ...courseData,
      gradeCategories: courseData.gradeCategories || []
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses.splice(index, 1);
    return true;
  }

  async getBySemester(semester) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.courses.filter(course => course.semester === semester);
  }

  async updateGrades(id, gradeCategories) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses[index].gradeCategories = gradeCategories;
    return { ...this.courses[index] };
  }
}

export const courseService = new CourseService();