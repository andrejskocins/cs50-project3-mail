document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Add send button functionality
  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    })
    .catch(err => console.error(err));

    return false; // Prevent default form submission
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch the emails for this mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Loop through each email and create a div for it
    emails.forEach(email => {
      const emailDiv = document.createElement('div');
      emailDiv.className = 'email-item';
      emailDiv.style.border = '1px solid #ddd';
      emailDiv.style.padding = '10px';
      emailDiv.style.margin = '5px 0';
      emailDiv.style.cursor = 'pointer';
      emailDiv.style.backgroundColor = email.read ? '#f5f5f5' : 'white';
      
      emailDiv.innerHTML = `
        <strong>${email.sender}</strong>
        <span style="float: right; color: #666;">${email.timestamp}</span>
        <button class="btn btn-sm btn-outline-primary" id="archived">
          <img src="{% static 'mail/img/archive.svg' %}" alt="Archive" style="height: 16px; vertical-align: -2px;">
            Archived
        </button>
        <br>
        ${email.subject}
      `;

      // Add click event to view email
      emailDiv.addEventListener('click', () => view_email(email.id));

      document.querySelector('#emails-view').append(emailDiv);
    });
  })
  .catch(err => console.error(err));
}

function view_email(id) {
  // Fetch the email
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    console.log(email);

    // TBI
    // Display email details
    const view = document.querySelector('#emails-view');
    view.style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    view.innerHTML = `
      <h3>${email.subject}</h3>
      <div><strong>From:</strong> ${email.sender}</div>
      <div><strong>To:</strong> ${email.recipients.join(', ')}</div>
      <div><strong>Timestamp:</strong> ${email.timestamp}</div>
      <hr>
      <pre style="white-space: pre-wrap;">${email.body}</pre>
    `;

    // Mark email as read
    if(!email.read) {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
        read: true
        })
      })
      .catch(err => console.error(err));
    }
  })
  .catch(err => console.error(err));

  
}