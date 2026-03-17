import {
  ProjectInquiryListResponse,
  ProjectInquiryResponse,
  ProjectInquiryStatus,
  ProjectInquiryStatusUpdateResponse,
  ProjectInquirySubmitRequest,
} from "@/types/project-inquiry";

export async function submitProjectInquiry(request: ProjectInquirySubmitRequest): Promise<ProjectInquiryResponse> {
  const response = await fetch("/api/project-inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return (await response.json()) as ProjectInquiryResponse;
}

export async function listProjectInquiries(): Promise<ProjectInquiryListResponse> {
  const response = await fetch("/api/project-inquiries", {
    method: "GET",
  });

  return (await response.json()) as ProjectInquiryListResponse;
}

export async function updateProjectInquiryStatus(id: string, status: ProjectInquiryStatus): Promise<ProjectInquiryStatusUpdateResponse> {
  const response = await fetch(`/api/project-inquiries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return (await response.json()) as ProjectInquiryStatusUpdateResponse;
}
