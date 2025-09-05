import { toast } from 'react-toastify';

class CourseService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };
      
      const response = await this.client.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [{
          Name: courseData.name || courseData.Name,
          code_c: courseData.code || courseData.code_c,
          professor_c: courseData.professor || courseData.professor_c,
          credits_c: parseInt(courseData.credits || courseData.credits_c) || 3,
          color_c: courseData.color || courseData.color_c || "#8B5CF6",
          semester_c: courseData.semester || courseData.semester_c || "Fall 2024",
          grade_categories_c: courseData.gradeCategories || courseData.grade_categories_c || ""
        }]
      };
      
      const response = await this.client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.name || courseData.Name,
          code_c: courseData.code || courseData.code_c,
          professor_c: courseData.professor || courseData.professor_c,
          credits_c: parseInt(courseData.credits || courseData.credits_c) || 3,
          color_c: courseData.color || courseData.color_c,
          semester_c: courseData.semester || courseData.semester_c,
          grade_categories_c: courseData.gradeCategories || courseData.grade_categories_c
        }]
      };
      
      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: Array.isArray(id) ? id : [id]
      };
      
      const response = await this.client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const recordIds = Array.isArray(id) ? id : [id];
        return successfulDeletions.length === recordIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  async getBySemester(semester) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
        ],
        where: [
          {
            FieldName: "semester_c",
            Operator: "EqualTo",
            Values: [semester]
          }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses by semester:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async updateGrades(id, gradeCategories) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          grade_categories_c: typeof gradeCategories === 'string' ? gradeCategories : JSON.stringify(gradeCategories)
        }]
      };
      
      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grades:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export const courseService = new CourseService();