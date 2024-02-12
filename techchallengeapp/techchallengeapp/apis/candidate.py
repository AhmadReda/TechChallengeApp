import frappe
from frappe.utils import validate_email_address

@frappe.whitelist(methods=["GET"])
def get_candidates():
    return frappe.db.get_list(
        'Candidate',
        fields=['name', 'candidate_name','email','experience','status'],
        order_by='candidate_name',
    )

@frappe.whitelist(methods=["POST"])
def add_candidates(candidate_name,email,experience,status):
    validate_candidate_params("",candidate_name,email,experience,status,False)

    candidate_doc = frappe.new_doc('Candidate')
    candidate_doc.candidate_name = candidate_name
    candidate_doc.email = email
    candidate_doc.experience = experience
    candidate_doc.status = status
    candidate_doc.insert()

@frappe.whitelist(methods=["PUT"])
def edit_candidates(id,candidate_name,email,experience,status):
    validate_candidate_params(id,candidate_name,email,experience,status,True)
    
    candidate_doc = frappe.get_doc('Candidate', id)
    candidate_doc.candidate_name = candidate_name
    candidate_doc.email = email
    candidate_doc.experience = experience
    candidate_doc.status = status
    candidate_doc.save()

@frappe.whitelist(methods=["DELETE"])
def delete_candidate(id):
    frappe.delete_doc_if_exists('Candidate', id)

@frappe.whitelist(methods=["GET"])
def get_candidate_meta():
    return frappe.get_meta('Candidate')

def validate_candidate_params(id,candidate_name,email,experience,status,has_id):
    if candidate_name is None or candidate_name == "":
        frappe.throw(f"Please submit the Name")
    if email is None or email =="":
        frappe.throw(f"Please submit the Email")
    if experience is None or experience =="":
        frappe.throw(f"Please submit the Experience")
    if status is None or status =="":
        frappe.throw(f"Please submit the Status")

    if not validate_email_address(email):
        frappe.throw(f"This email <b>[{email}]</b> is not valid")

    if has_id:
        if id is None or id == "":
            frappe.throw(f"Please submit valid Candidate Id")
        if not frappe.db.exists("Candidate", id):
            frappe.throw(f"This Candidate not exist")
    else:
        if frappe.db.exists("Candidate", {"candidate_name": candidate_name, "email":email}):
            frappe.throw(f"This user <b>[{candidate_name}]</b> exist before with this email <b>[{email}]</b>")