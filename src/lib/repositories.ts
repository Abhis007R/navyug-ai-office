import { Donor, Student, Volunteer } from "../types";
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://navyug-ai-office.onrender.com";
export class DonorRepository {
  static async getAll(): Promise<Donor[]> {
    const res = await fetch(`${API_BASE}/api/crm`)
    if (!res.ok) throw new Error("Failed to fetch donors");
    const data = await res.json();
    return data.donors || [];
  }

  static async create(item: Omit<Donor, "id">): Promise<Donor> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "donors", action: "add", item }),
    });
    if (!res.ok) throw new Error("Failed to create donor");
    const data = await res.json();
    return data.item;
  }

  static async update(item: Donor): Promise<Donor> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "donors", action: "edit", item }),
    });
    if (!res.ok) throw new Error("Failed to update donor");
    const data = await res.json();
    return data.item;
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "donors", action: "delete", item: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete donor");
  }
}

export class StudentRepository {
  static async getAll(): Promise<Student[]> {
    const res = await fetch(`${API_BASE}/api/crm`)
    if (!res.ok) throw new Error("Failed to fetch students");
    const data = await res.json();
    return data.students || [];
  }

  static async create(item: Omit<Student, "id">): Promise<Student> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "students", action: "add", item }),
    });
    if (!res.ok) throw new Error("Failed to create student");
    const data = await res.json();
    return data.item;
  }

  static async update(item: Student): Promise<Student> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "students", action: "edit", item }),
    });
    if (!res.ok) throw new Error("Failed to update student");
    const data = await res.json();
    return data.item;
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "students", action: "delete", item: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete student");
  }
}

export class VolunteerRepository {
  static async getAll(): Promise<Volunteer[]> {
    const res = await fetch(`${API_BASE}/api/crm`)
    if (!res.ok) throw new Error("Failed to fetch volunteers");
    const data = await res.json();
    return data.volunteers || [];
  }

  static async create(item: Omit<Volunteer, "id">): Promise<Volunteer> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "volunteers", action: "add", item }),
    });
    if (!res.ok) throw new Error("Failed to create volunteer");
    const data = await res.json();
    return data.item;
  }

  static async update(item: Volunteer): Promise<Volunteer> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "volunteers", action: "edit", item }),
    });
    if (!res.ok) throw new Error("Failed to update volunteer");
    const data = await res.json();
    return data.item;
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/crm/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "volunteers", action: "delete", item: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete volunteer");
  }
}
