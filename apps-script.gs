/**
 * Portfolio lead form  →  Google Sheet + email notification
 * ----------------------------------------------------------
 * Receives a POST from the contact form on your portfolio site,
 * appends a row to your spreadsheet, and emails you a notification.
 *
 * Deploy steps are in SETUP.md. Quick version:
 *   1. Open your Sheet → Extensions → Apps Script
 *   2. Replace everything with this file, Save
 *   3. Deploy → New deployment → Web app
 *        • Execute as: Me
 *        • Who has access: Anyone
 *   4. Copy the Web app URL into script.js (FORM_ENDPOINT)
 */

// ---- Config -------------------------------------------------
var SHEET_ID    = '1X5lmOMhqhq669vjhdXcqWR6kFiYBboc0FecJZV-Ovf0'; // your spreadsheet
var SHEET_TAB   = '';                  // '' = first tab (gid=0). Or set a tab name.
var NOTIFY_EMAIL = 'jaspher.lising01@gmail.com';
var HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Message', 'Source page'];
// -------------------------------------------------------------

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Honeypot: silently accept and ignore bot submissions.
    if (data.company_website) {
      return jsonOut({ ok: true });
    }

    var name    = String(data.name    || '').trim();
    var email   = String(data.email   || '').trim();
    var phone   = String(data.phone   || '').trim();
    var message = String(data.message || '').trim();
    var page    = String(data.page    || '').trim();

    if (!name || !email || !message) {
      return jsonOut({ ok: false, error: 'Missing required fields.' });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = SHEET_TAB ? ss.getSheetByName(SHEET_TAB) : ss.getSheets()[0];

    // Add a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var ts = new Date();
    sheet.appendRow([ts, name, email, phone, message, page]);

    // Email notification.
    var subject = 'New portfolio inquiry — ' + name;
    var body =
      'You have a new inquiry from your portfolio site.\n\n' +
      'Name:    ' + name + '\n' +
      'Email:   ' + email + '\n' +
      'Phone:   ' + (phone || '—') + '\n' +
      'Page:    ' + (page || '—') + '\n' +
      'Time:    ' + ts + '\n\n' +
      'Message:\n' + message + '\n\n' +
      '— Reply directly to this email to respond to ' + name + '.';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: email,
      name: 'Portfolio site'
    });

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// Visiting the Web app URL in a browser hits this — handy to confirm it's live.
function doGet() {
  return jsonOut({ ok: true, status: 'Lead form endpoint is live. Submit via POST.' });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: run this once from the editor (Run ▶ testEmail) to grant the
 * Gmail + Sheets permissions up front and confirm email delivery works.
 */
function testEmail() {
  MailApp.sendEmail(NOTIFY_EMAIL, 'Portfolio form — test', 'If you got this, email notifications work.');
  Logger.log('Sent test email to ' + NOTIFY_EMAIL);
}
