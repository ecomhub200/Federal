/**
 * CL notifications.emailChips — email chip controls
 * Extracted from app/index.html L32431–L32650 on 2026-05-20 (Lane F).
 * No behavior change. Reads tempEmailList + notificationState + esc()
 * from the shared classic-script global lexical environment.
 */
(function(){
    'use strict';

    // ─── EXTRACTED CODE START (verbatim L32431–L32650) ───
function initEmailChipState() {
    tempEmailList = [...notificationState.preferences.emails];
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add email from input field
function addEmailFromInput() {
    const input = document.getElementById('emailInput');
    if (!input) return;

    const value = input.value.trim();
    if (value && isValidEmail(value)) {
        addEmailChip(value);
        input.value = '';
    }
}

// Add email chip
function addEmailChip(email) {
    email = email.trim().toLowerCase();

    // Check if already exists
    if (tempEmailList.some(e => e.address.toLowerCase() === email)) {
        showEmailError('This email is already added');
        return false;
    }

    // Validate format
    if (!isValidEmail(email)) {
        showEmailError('Please enter a valid email address');
        return false;
    }

    // Add to list (first email is primary by default)
    tempEmailList.push({
        address: email,
        isPrimary: tempEmailList.length === 0
    });

    refreshEmailChips();
    return true;
}

// Remove email chip
function removeEmailChip(email) {
    const index = tempEmailList.findIndex(e => e.address === email);
    if (index === -1) return;

    const wasPrimary = tempEmailList[index].isPrimary;
    tempEmailList.splice(index, 1);

    // If removed was primary, make first remaining email primary
    if (wasPrimary && tempEmailList.length > 0) {
        tempEmailList[0].isPrimary = true;
    }

    refreshEmailChips();
}

// Set email as primary
function setEmailPrimary(email) {
    tempEmailList.forEach(e => {
        e.isPrimary = e.address === email;
    });
    refreshEmailChips();
}

// Clear all emails
function clearAllEmails() {
    if (tempEmailList.length === 0) return;

    if (confirm('Remove all email recipients?')) {
        tempEmailList = [];
        refreshEmailChips();
    }
}

// Handle keyboard input
function handleEmailInputKeydown(event) {
    const input = event.target;
    const value = input.value.trim();

    // Enter or comma to add
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        if (value) {
            // Remove trailing comma if typed
            const cleanValue = value.replace(/,+$/, '').trim();
            if (cleanValue && addEmailChip(cleanValue)) {
                input.value = '';
            }
        }
    }
    // Backspace to remove last chip when input is empty
    else if (event.key === 'Backspace' && value === '' && tempEmailList.length > 0) {
        const lastEmail = tempEmailList[tempEmailList.length - 1].address;
        removeEmailChip(lastEmail);
    }
}

// Handle paste - support multiple emails
function handleEmailPaste(event) {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');

    // Split by common delimiters: comma, semicolon, newline, space
    const emails = pastedText.split(/[,;\s\n]+/).filter(e => e.trim());

    let addedCount = 0;
    let invalidCount = 0;

    emails.forEach(email => {
        email = email.trim();
        if (email) {
            if (addEmailChip(email)) {
                addedCount++;
            } else {
                invalidCount++;
            }
        }
    });

    if (addedCount > 0) {
        showEmailSuccess(`Added ${addedCount} email${addedCount > 1 ? 's' : ''}`);
    }
    if (invalidCount > 0 && addedCount === 0) {
        showEmailError(`${invalidCount} invalid or duplicate email${invalidCount > 1 ? 's' : ''}`);
    }
}

// Show temporary error message
function showEmailError(message) {
    showEmailToast(message, '#ef4444', '#fef2f2');
}

// Show temporary success message
function showEmailSuccess(message) {
    showEmailToast(message, '#10b981', '#ecfdf5');
}

// Generic toast for email feedback
function showEmailToast(message, color, bgColor) {
    const container = document.getElementById('emailChipsContainer');
    if (!container) return;

    // Remove any existing toast
    const existing = document.getElementById('emailToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'emailToast';
    toast.style.cssText = `position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:${bgColor};color:${color};padding:6px 12px;border-radius:6px;font-size:.8rem;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,0.1);white-space:nowrap;z-index:10;animation:fadeIn .2s ease`;
    toast.textContent = message;

    container.style.position = 'relative';
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}

// Refresh/re-render subscriber list (table layout)
function refreshEmailChips() {
    const input = document.getElementById('emailInput');
    const listContainer = document.getElementById('subscriberListContainer');
    if (!input || !listContainer) return;

    // Store input value and focus state
    const inputValue = input.value;
    const wasFocused = document.activeElement === input;

    // Generate subscriber rows HTML
    if (tempEmailList.length === 0) {
        listContainer.innerHTML = '<div style="padding:1.5rem;text-align:center;color:#94a3b8;font-size:.85rem">No subscribers added yet. Add an email above to get started.</div>';
    } else {
        listContainer.innerHTML = tempEmailList.map((e, i) => `
            <div class="subscriber-row" data-email="${esc(e.address)}" style="display:flex;align-items:center;gap:.5rem;padding:8px 12px;border-bottom:${i === tempEmailList.length - 1 ? 'none' : '1px solid #f1f5f9'};transition:background .15s" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <span style="width:20px;text-align:center;color:${e.isPrimary ? '#f59e0b' : '#d1d5db'};font-size:.9rem;cursor:pointer" onclick="setEmailPrimary('${esc(e.address)}')" title="${e.isPrimary ? 'Primary recipient' : 'Set as primary'}">&#9733;</span>
                <span style="flex:1;font-size:.85rem;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.address)}</span>
                ${e.isPrimary ? '<span style="font-size:.65rem;background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:4px;font-weight:500">Primary</span>' : '<button onclick="setEmailPrimary(\''+esc(e.address)+'\')" style="font-size:.65rem;background:none;color:#3b82f6;border:1px solid #bfdbfe;padding:1px 6px;border-radius:4px;cursor:pointer;transition:background .15s" onmouseover="this.style.background=\'#eff6ff\'" onmouseout="this.style.background=\'none\'">Set Primary</button>'}
                <button onclick="removeEmailChip('${esc(e.address)}')" style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border:none;background:none;cursor:pointer;color:#94a3b8;border-radius:6px;transition:all .15s;font-size:16px" onmouseover="this.style.background='#fef2f2';this.style.color='#ef4444'" onmouseout="this.style.background='none';this.style.color='#94a3b8'" title="Delete subscriber">&times;</button>
            </div>
        `).join('');
    }

    // Update input
    input.placeholder = tempEmailList.length === 0 ? 'Enter email address...' : 'Enter email address...';
    input.value = inputValue;

    // Update count badge
    const countEl = document.getElementById('emailCount');
    if (countEl) {
        countEl.textContent = `${tempEmailList.length} subscriber${tempEmailList.length !== 1 ? 's' : ''}`;
    }

    // Update sync badge
    const syncBadge = document.getElementById('subscriberSyncBadge');
    if (syncBadge) {
        syncBadge.textContent = notificationState.r2Synced ? 'Saved to cloud' : 'Local only';
        syncBadge.style.background = notificationState.r2Synced ? '#dcfce7' : '#f1f5f9';
        syncBadge.style.color = notificationState.r2Synced ? '#166534' : '#64748b';
    }

    // Update clear button state
    const clearBtn = document.querySelector('button[onclick="clearAllEmails()"]');
    if (clearBtn) {
        clearBtn.disabled = tempEmailList.length === 0;
        clearBtn.style.opacity = tempEmailList.length === 0 ? '.4' : '1';
        clearBtn.style.cursor = tempEmailList.length === 0 ? 'not-allowed' : 'pointer';
    }

    // Restore focus
    if (wasFocused) {
        input.focus();
    }
}
    // ─── EXTRACTED CODE END ───

    window.CL = window.CL || {};
    CL.notifications = CL.notifications || {};
    CL.notifications.emailChips = CL.notifications.emailChips || {};

    // Dual public API (HTML onclick= compatibility)
    window.initEmailChipState = initEmailChipState;            CL.notifications.emailChips.initEmailChipState = initEmailChipState;
    window.isValidEmail = isValidEmail;                        CL.notifications.emailChips.isValidEmail = isValidEmail;
    window.addEmailFromInput = addEmailFromInput;              CL.notifications.emailChips.addEmailFromInput = addEmailFromInput;
    window.addEmailChip = addEmailChip;                        CL.notifications.emailChips.addEmailChip = addEmailChip;
    window.removeEmailChip = removeEmailChip;                  CL.notifications.emailChips.removeEmailChip = removeEmailChip;
    window.setEmailPrimary = setEmailPrimary;                  CL.notifications.emailChips.setEmailPrimary = setEmailPrimary;
    window.clearAllEmails = clearAllEmails;                    CL.notifications.emailChips.clearAllEmails = clearAllEmails;
    window.handleEmailInputKeydown = handleEmailInputKeydown;  CL.notifications.emailChips.handleEmailInputKeydown = handleEmailInputKeydown;
    window.handleEmailPaste = handleEmailPaste;                CL.notifications.emailChips.handleEmailPaste = handleEmailPaste;
    window.showEmailError = showEmailError;                    CL.notifications.emailChips.showEmailError = showEmailError;
    window.showEmailSuccess = showEmailSuccess;                CL.notifications.emailChips.showEmailSuccess = showEmailSuccess;
    window.showEmailToast = showEmailToast;                    CL.notifications.emailChips.showEmailToast = showEmailToast;
    window.refreshEmailChips = refreshEmailChips;              CL.notifications.emailChips.refreshEmailChips = refreshEmailChips;

    CL._registerModule('notifications/email-chips');
})();
