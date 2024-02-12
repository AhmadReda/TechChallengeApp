import frappe

@frappe.whitelist()
def delete_rejected_candidates():
    frappe.db.delete("Candidate", {
        "status":"Rejected"
    })