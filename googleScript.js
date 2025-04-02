function doGet(e) {
    try {
      if (!e || !e.parameter) {
        throw new Error("Missing event parameter or query parameters.");
      }
      const isFilter = e.parameter.action === 'filter'
      const sheetName = isFilter ? "Filters" : e.parameter.sheet || 'Transactions';
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

      if (!sheet) {
        throw new Error(`Sheet '${sheetName}' not found.`);
      }
      if (e.parameter.action === 'getTransaction') {
        return getTransaction(e.parameter.transactionId, e.parameter.token);
      }

      const data = sheet.getDataRange().getValues();

      if (isFilter) {
        // Extract the headers and rows
        const [_, headers, ...rows] = data;
        const dataRows = rows.slice(0, -1); // Remove the last row which is for grand total


        // Normalize headers to lowercase for case-insensitive comparison
        const normalizedHeaders = headers.map(header => header.toLowerCase());

        // Dynamically find the indices of 'income' and 'expense'
        const incomeIndex = normalizedHeaders.indexOf('income');
        const expenseIndex = normalizedHeaders.indexOf('expense');

        if (incomeIndex === -1 || expenseIndex === -1) {
          Logger.log('Missing column: "income" or "expense" column in the headers');
        }

        // Convert rows into objects
        const result = dataRows.map(row => {
          const field = row[0]; // Assuming the first column is always the "field" name
          if (!field) return;

          const incomeNum = incomeIndex === -1 ? 0 : Number(row[incomeIndex]);
          const expenseNum = expenseIndex === -1 ? 0 : Number(row[expenseIndex]);
          const bal = incomeNum - expenseNum;

          // Calculate net profit percent safely
          const netProfitPercent = incomeNum > 0
            ? `${((bal / incomeNum) * 100).toFixed(2)}%`
            : "0%"; // Default to 0% when income is 0 or invalid

          return {
            name: field,
            expense: expenseNum,
            income: incomeNum,
            balance: bal,
            "net profit percent": netProfitPercent
          };
        });

        return ContentService
          .createTextOutput(JSON.stringify(result.filter(row => !!row)))
          .setMimeType(ContentService.MimeType.JSON);
      }


      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function doPost(e) {
    try {
      if (!e || !e.postData || !e.postData.contents) {
        throw new Error("Missing event parameter or post data.");
      }

      const data = JSON.parse(e.postData.contents);
      if (!data.action) {
        throw new Error("Action is required.");
      }

      if (data.action === 'addTransaction') {
        return addTransaction(data);
      } else if (data.action === 'reviewTransaction') {
        return reviewData(data);
      } else {
        throw new Error("Invalid action.");
      }
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function addTransaction(data) {
    // Log data for debugging
    // Logger.log(data);

    // Validate that data is not undefined or null
    if (!data || !data.name || !data.description || !data.type || !data.field || !data.amount) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: "Required fields: name, description, type, field, amount" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions');

    // Generate a unique Transaction ID
    const transactionId = "TX-" + new Date().getTime();
    const currentDate = new Date();

    try {
      // Prepare data for appending to the sheet
      const sheetData = [
        currentDate,                    // Date
        transactionId,                  // Transaction ID
        data.name,                      // Name
        data.description,               // Description
        data.type,                      // Type
        data.field,                     // Field
        data.amount,                    // Amount
        data.notes || '',               // Notes
        '', '', '', '',                 // Reviewer1 to Reviewer4
        currentDate                     // Last Updated
      ];

      sheet.appendRow(sheetData);

      // Send email to each reviewer with a unique verification link
      const reviewers = getReviewers();
      reviewers.forEach(email => sendVerificationEmail(email, transactionId));

      const response = { status: 'success', transactionId, sheetData };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: error.message })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function getTransaction(transactionId, token) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions');
    const range = sheet.getDataRange();
    const values = range.getValues();

    // Verify the token
    const email = verifyToken(transactionId, token); // Implement verifyToken based on your hashing logic
    const reviewers = getReviewers(); // Get your reviewers array

    if (!reviewers.includes(email)) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid reviewer or token.' })).setMimeType(ContentService.MimeType.JSON);
    }

    for (let i = 1; i < values.length; i++) {
      if (values[i][1] == transactionId) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', transaction: values[i] })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Transaction not found.' })).setMimeType(ContentService.MimeType.JSON);
  }


  function reviewData(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions');
    const range = sheet.getDataRange();
    const values = range.getValues();

    const { transactionId, token } = data;

    if (!transactionId || !token) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: "Transaction ID and token are required." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const reviewerEmail = verifyToken(transactionId, token);

    try {
      for (let i = 1; i < values.length; i++) {
        if (values[i][1] === transactionId) { // Match Transaction ID
          const row = i + 1;
          const reviewerColumns = [ 9, 10, 11,12]; // Reviewer1 to Reviewer4 columns

          // Check for existing review by this reviewer
          if (reviewerColumns.some(col => values[i][col - 1] === reviewerEmail)) {
            return ContentService.createTextOutput(
              JSON.stringify({ status: 'error', message: "You have already reviewed this transaction." })
            ).setMimeType(ContentService.MimeType.JSON);
          }

          // Add the reviewer to the first available slot
          for (const col of reviewerColumns) {
            if (!values[i][col - 1]) {
              sheet.getRange(row, col).setValue(reviewerEmail);
              sheet.getRange(row, 13).setValue(new Date()); // Update Last Updated column
              sendEmailReceipt(values[i])
              return ContentService.createTextOutput(
                JSON.stringify({ status: 'success', message: "Review submitted successfully." })
              ).setMimeType(ContentService.MimeType.JSON);
            }
          }

          // All slots filled
          return ContentService.createTextOutput(
            JSON.stringify({ status: 'error', message: "This transaction has already been reviewed by all reviewers." })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: "Transaction not found." })
      ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: error.message })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function getReviewers() {
    return ['hardware@afripulgroup.com', 'admin@afripulgroup.com', 'software@afripulgroup.com', 'design@afripulgroup.com'];
  }

  function verifyToken(transactionId, token) {
    const reviewers = getReviewers();

    for (const email of reviewers) {
      const storedHashSalt = PropertiesService.getScriptProperties().getProperty(`emailHash_${transactionId}_${email}`);
      if (!storedHashSalt) continue;

      const [storedHash, salt] = storedHashSalt.split(':');
      const computedHash = Utilities.base64EncodeWebSafe(
        Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email + salt)
      );

      if (token === computedHash) {
        return email; // Verified reviewer email
      }
    }

    throw new Error("Invalid or expired token.");
  }

  function sendVerificationEmail(email, transactionId) {
    const salt = Utilities.getUuid(); // Unique salt for each email link
    const hash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email + salt));

    // Store salt and hash for verification later
    PropertiesService.getScriptProperties().setProperty(`emailHash_${transactionId}_${email}`, hash + ':' + salt);

    const frontendURL = `https://modsontech45.github.io/AfR-Expense-Tracker/review.html?token=${hash}&transactionId=${transactionId}`;

    const subject = "Please Review the Transaction";
    const body = `
      <p>Hello,</p>
      <p>A new transaction requires your review. Please click the link below to verify and review the transaction:</p>
      <a href="${frontendURL}">Review Transaction</a>
      <p>Best regards,</p>
      <p>Your Team</p>
      <p>${new Date().toLocaleDateString()}</p>

    `;
    MailApp.sendEmail({ to: email, subject: subject, htmlBody: body });
  }

  function sendEmailReceipt(transactionData) {
    try {
      const reviewers = getReviewers();
      const subject = "Transaction Receipt - " + transactionData[1];
      const body = `
              <p>Hello,</p>
              <p>A transaction has been reviewed and completed:</p>
              <ul>
                  <li><strong>Date:</strong> ${transactionData[0]}</li>
                  <li><strong>Transaction ID:</strong> ${transactionData[1]}</li>
                  <li><strong>Name:</strong> ${transactionData[2]}</li>
                  <li><strong>Description:</strong> ${transactionData[3]}</li>
                  <li><strong>Type:</strong> ${transactionData[4]}</li>
                  <li><strong>Field:</strong> ${transactionData[5]}</li>
                  <li><strong>Amount:</strong> ${transactionData[6]} FCFA</li>
                  <li><strong>Notes:</strong> ${transactionData[7]}</li>
              </ul>
              <p>Best Regards,<br>Your Expense Tracker</p>
          `;

      MailApp.sendEmail({
        to: "admin@afripulgroup.com",
        cc: reviewers.join(","),
        subject: subject,
        htmlBody: body
      });
    } catch (error) {
      Logger.log("Failed to send email: " + error.message);
    }
  }