document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email(false, null));

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

function compose_email(replying, email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (!replying || !email) {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    return;
  }
  
  document.querySelector('#compose-recipients').value = email.sender;

  let subject = email.subject || '';
  if (!/^re:/i.test(subject)) subject = `Re: ${subject}`;
  document.querySelector('#compose-subject').value = subject;

  document.querySelector('#compose-body').value =
    `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  const emailsView = document.querySelector('#emails-view');

  // Show the mailbox name
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const archiveIconUrl   = emailsView.dataset.archiveIcon;
  const unarchiveIconUrl = emailsView.dataset.unarchiveIcon;

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

      // Don't show archive button for sent emails
      const showArchiveBtn = mailbox !== 'sent';
      const isArchived = email.archived;
      const buttonText = isArchived ? 'Unarchive' : 'Archive';
      const iconSrc = isArchived ? unarchiveIconUrl : archiveIconUrl;
      
      emailDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${email.sender}</strong>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #666;">${email.timestamp}</span>
              ${showArchiveBtn ? `
                <button class="btn btn-sm btn-outline-primary archive-btn" type="button" title="${buttonText}">
                  <img src="${iconSrc}" alt="${buttonText}" style="height: 16px; vertical-align: -2px;">
                </button>
              ` : ''}
            </div>
          </div>
          <div>${email.subject}</div>
      `;
      
      // Add archive button click handler
      if (showArchiveBtn) {
        const archiveBtn = emailDiv.querySelector('.archive-btn');
        archiveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Toggle archive status
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              archived: !isArchived
            })
          })
          .then(() => {
            // Reload inbox after archiving/unarchiving
            load_mailbox('inbox');
          })
          .catch(err => console.error(err));
        });
      }

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

    const emailsView = document.querySelector('#emails-view');
    const replyIconUrl = emailsView.dataset.replyIcon;

    // Display email details
    emailsView.style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    emailsView.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0;">${email.subject}</h3>
        <button id="reply-button" class="btn btn-sm btn-outline-primary" type="button" title="Reply">
          <img src="${replyIconUrl}" alt="Reply" style="height: 16px; vertical-align: -2px;">
        </button>
      </div>
      <div><strong>From:</strong> ${email.sender}</div>
      <div><strong>To:</strong> ${email.recipients.join(', ')}</div>
      <div><strong>Timestamp:</strong> ${email.timestamp}</div>
      <hr>
      <pre style="white-space: pre-wrap;">${email.body}</pre>
    `;

    // Add reply button click handler
    const replyBtn = emailsView.querySelector('#reply-button');
    replyBtn.addEventListener('click', () => {
      compose_email(true, email)
      console.log('Reply to email:', email);
    });

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