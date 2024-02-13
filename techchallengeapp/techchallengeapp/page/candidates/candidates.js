var page;
frappe.pages['candidates'].on_page_load = async function(wrapper) {
	page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Candidates',
		single_column: true
	});
	await get_candidates(page)
	page.set_primary_action('New Candidate', () => create_new_candidate(page))
	page.set_secondary_action('Refresh', () => get_candidates(page))
}
async function get_candidates(page){
	$(page.body).children("table").remove();
	let result =  await frappe.call({method:'techchallengeapp.techchallengeapp.apis.candidate.get_candidates',type: "GET"})
	$(frappe.render_template("candidates",{candidates:result.message})).appendTo(page.body)
}
async function create_new_candidate(page){
	let candidate_meta =  await frappe.call({method:'techchallengeapp.techchallengeapp.apis.candidate.get_candidate_meta',type: "GET"})
	let d = new frappe.ui.Dialog({
		title: 'Create New Candidate',
		fields: [
			{
				label: 'Name',
				fieldname: 'candidate_name',
				fieldtype: 'Data',
				reqd:1
			},
			{
				label: 'Email',
				fieldname: 'email',
				fieldtype: 'Data',
				options:'Email',
				reqd:1
			},
			{
				label: '',
				fieldname: 'email',
				fieldtype: 'Column Break'
			},
			{
				label: 'Experience',
				fieldname: 'experience',
				fieldtype: 'Select',
				options: candidate_meta['message']['fields'][3]['options'],
				reqd:1
			},
			{
				label: 'Status',
				fieldname: 'status',
				fieldtype: 'Select',
				options: candidate_meta['message']['fields'][4]['options'],
				reqd:1
			}
		],
		size: 'large',
		primary_action_label: 'Create',
		primary_action(values) {
			frappe.call({
				method:'techchallengeapp.techchallengeapp.apis.candidate.add_candidates',
				args:values,
				type: "POST"
			})
			.then(async r=>{
				await get_candidates(page)
				frappe.show_alert({
					message:__(`Candidate ${values['candidate_name']} created successfully`),
					indicator:'green'
				}, 5)
				d.hide();
			})
		}
	});
	
	d.show();
}
async function edit_candidate(button){
	let candidate_meta =  await frappe.call({method:'techchallengeapp.techchallengeapp.apis.candidate.get_candidate_meta',type: "GET"})
	let d = new frappe.ui.Dialog({
		title: `${button.parentNode.parentNode.dataset.candidate_name}`,
		fields: [
			{
				label: 'Name',
				fieldname: 'candidate_name',
				fieldtype: 'Data',
				default:button.parentNode.parentNode.dataset.candidate_name
			},
			{
				label: 'Email',
				fieldname: 'email',
				fieldtype: 'Data',
				options:'Email',
				default:button.parentNode.parentNode.dataset.email
			},
			{
				label: '',
				fieldname: 'email',
				fieldtype: 'Column Break'
			},
			{
				label: 'Experience',
				fieldname: 'experience',
				fieldtype: 'Select',
				options: candidate_meta['message']['fields'][3]['options'],
				default:button.parentNode.parentNode.dataset.experience
			},
			{
				label: 'Status',
				fieldname: 'status',
				fieldtype: 'Select',
				options: candidate_meta['message']['fields'][4]['options'],
				default:button.parentNode.parentNode.dataset.status
			}
		],
		size: 'large',
		primary_action_label: 'Update',
		primary_action(values) {
			values['id'] = button.parentNode.parentNode.dataset.id
			frappe.call({
				method:'techchallengeapp.techchallengeapp.apis.candidate.edit_candidates',
				args:values,
				type: "PUT"
			})
			.then(async r=>{
				await get_candidates(page)
				frappe.show_alert({
					message:__(`Candidate ${values['candidate_name']} updated successfully`),
					indicator:'green'
				}, 5)
				d.hide();
			})
		}
	});
	
	d.show();
	console.log(button.parentNode.parentNode.dataset.email)
}
function delete_candidate(button){
	frappe.warn(
		'Are you sure you want to proceed?',
		`Do you want to delete Candidate ${button.parentNode.parentNode.dataset.candidate_name}?`,
    	() => {
			// action to perform if Continue is selected
			frappe.call({
				method:'techchallengeapp.techchallengeapp.apis.candidate.delete_candidate',
				args:{'id':button.parentNode.parentNode.dataset.id},
				type: "DELETE"
			})
			.then(async r=>{
				await get_candidates(page)
				frappe.show_alert({
					message:__(`Candidate ${button.parentNode.parentNode.dataset.candidate_name} deleted successfully`),
					indicator:'green'
				}, 5)
				d.hide();
			})
    	},
    	'Continue',
    	true // Sets dialog as minimizable
	)
}