Audit Log Conditions for getAutoTextList (autoText.controller.js)

1. Clinic Not Found
Action: VIEW
Outcome: DENIED
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: req.userId or SYSTEM
entityType: CLINIC

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "CLINIC",
  "action": "VIEW",
  "outcome": "DENIED",
  "metadata": { "reason": "CLINIC_NOT_FOUND" },
  "ipAddress": "<req.ipAddress>"
}

2. View Success (empty)
Action: VIEW
Outcome: SUCCESS
Metadata: { totalRecords, currentPage, lastPage }
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "VIEW",
  "outcome": "SUCCESS",
  "metadata": { "totalRecords": 0, "currentPage": 1, "lastPage": 1 },
  "ipAddress": "<req.ipAddress>"
}

3. View Success (results)
Action: VIEW
Outcome: SUCCESS
Metadata: { totalRecords, currentPage, lastPage }
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "VIEW",
  "outcome": "SUCCESS",
  "metadata": { "totalRecords": 10, "currentPage": 1, "lastPage": 1 },
  "ipAddress": "<req.ipAddress>"
}

4. View Failed (catch)
Action: VIEW
Outcome: FAILED
Metadata: { error: error.message }
userId: req.userId or SYSTEM
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "VIEW",
  "outcome": "FAILED",
  "metadata": { "error": "<error.message>" },
  "ipAddress": "<req.ipAddress>"
}


Audit Log Conditions for createAutoText (autoText.controller.js)

1. Create Success
Action: CREATE
Outcome: SUCCESS
attempt: req.body
after: <new document>
entityId: <newId>
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<clinicId>",
  "entityType": "AUTOTEXT",
  "action": "CREATE",
  "outcome": "SUCCESS",
  "attempt": { /* req.body */ },
  "after": { /* new doc */ },
  "entityId": "<id>",
  "ipAddress": "<req.ipAddress>"
}

2. Create Failed (catch)
Action: CREATE
Outcome: FAILED
attempt: req.body
Metadata: { error: error.message }
userId: req.userId or SYSTEM
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "CREATE",
  "outcome": "FAILED",
  "attempt": { /* req.body */ },
  "metadata": { "error": "<error.message>" },
  "ipAddress": "<req.ipAddress>"
}


Audit Log Conditions for getAutoTextById (autoText.controller.js)

1. Clinic Not Found
Action: VIEW
Outcome: DENIED
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: req.userId or SYSTEM
entityType: CLINIC

Sample Log:
{ "userId": "<req.userId>", "clinicId": "<req.clinicId>", "entityType": "CLINIC", "action": "VIEW", "outcome": "DENIED", "metadata": { "reason": "CLINIC_NOT_FOUND" }, "ipAddress": "<req.ipAddress>" }

2. AutoText Not Found
Action: VIEW
Outcome: DENIED
Metadata: { reason: "AUTOTEXT_NOT_FOUND" }
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "VIEW",
  "outcome": "DENIED",
  "entityId": "<autoTextId>",
  "metadata": { "reason": "AUTOTEXT_NOT_FOUND" },
  "ipAddress": "<req.ipAddress>"
}

3. View Success
Action: VIEW
Outcome: SUCCESS
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "VIEW",
  "outcome": "SUCCESS",
  "entityId": "<autoTextId>",
  "metadata": {},
  "ipAddress": "<req.ipAddress>"
}


Audit Log Conditions for updateAutoText (autoText.controller.js)

1. Clinic Not Found
Action: UPDATE
Outcome: DENIED
attempt: req.body
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: req.userId or SYSTEM
entityType: CLINIC

Sample Log:
{ "userId": "<req.userId>", "clinicId": "<req.clinicId>", "entityType": "CLINIC", "action": "UPDATE", "outcome": "DENIED", "attempt": { /* req.body */ }, "metadata": { "reason": "CLINIC_NOT_FOUND" }, "ipAddress": "<req.ipAddress>" }

2. Update Denied - not found
Action: UPDATE
Outcome: DENIED
attempt: req.body
Metadata: { reason: "AUTOTEXT_NOT_FOUND" }
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "UPDATE",
  "outcome": "DENIED",
  "attempt": { /* req.body */ },
  "entityId": "<autoTextId>",
  "metadata": { "reason": "AUTOTEXT_NOT_FOUND" },
  "ipAddress": "<req.ipAddress>"
}

3. Update Success
Action: UPDATE
Outcome: SUCCESS
attempt: req.body
before: <previous document>
after: <updated document>
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "UPDATE",
  "outcome": "SUCCESS",
  "attempt": { /* req.body */ },
  "before": { /* previous */ },
  "after": { /* updated */ },
  "entityId": "<autoTextId>",
  "ipAddress": "<req.ipAddress>"
}

4. Update Failed (catch)
Action: UPDATE
Outcome: FAILED
attempt: req.body
Metadata: { error: error.message }
userId: req.userId or SYSTEM
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "UPDATE",
  "outcome": "FAILED",
  "attempt": { /* req.body */ },
  "metadata": { "error": "<error.message>" },
  "ipAddress": "<req.ipAddress>"
}


Audit Log Conditions for deleteAutoText (autoText.controller.js)

1. Delete Denied - clinic not found
Action: DELETE
Outcome: DENIED
attempt: req.body
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: req.userId or SYSTEM
entityType: CLINIC

Sample Log:
{ "userId": "<req.userId>", "clinicId": "<req.clinicId>", "entityType": "CLINIC", "action": "DELETE", "outcome": "DENIED", "attempt": { /* req.body */ }, "metadata": { "reason": "CLINIC_NOT_FOUND" }, "ipAddress": "<req.ipAddress>" }

2. Delete Denied - not found
Action: DELETE
Outcome: DENIED
attempt: req.body
Metadata: { reason: "AUTOTEXT_NOT_FOUND" }
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "DELETE",
  "outcome": "DENIED",
  "attempt": { /* req.body */ },
  "entityId": "<autoTextId>",
  "metadata": { "reason": "AUTOTEXT_NOT_FOUND" },
  "ipAddress": "<req.ipAddress>"
}

3. Delete Success
Action: DELETE
Outcome: SUCCESS
attempt: req.body
before: <previous document>
after: <updated document>
entityId: autoTextId
userId: req.userId
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "DELETE",
  "outcome": "SUCCESS",
  "attempt": { /* req.body */ },
  "before": { /* previous */ },
  "after": { /* updated */ },
  "entityId": "<autoTextId>",
  "ipAddress": "<req.ipAddress>"
}

4. Delete Failed (catch)
Action: DELETE
Outcome: FAILED
attempt: req.body
Metadata: { error: error.message }
userId: req.userId or SYSTEM
entityType: AUTOTEXT

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "AUTOTEXT",
  "action": "DELETE",
  "outcome": "FAILED",
  "attempt": { /* req.body */ },
  "metadata": { "error": "<error.message>" },
  "ipAddress": "<req.ipAddress>"
}
