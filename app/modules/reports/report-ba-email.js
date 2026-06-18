/**
 * CL reports.ba — BA email scheduling + PDF-for-email
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function openBAEmailSchedule() {
    if (!baState.results) {
        showToast('Run a Before/After analysis first', 'warning');
        return;
    }
    // Store B/A context for the modal to pick up
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect ? treatmentSelect.options[treatmentSelect.selectedIndex].text : baState.treatmentType;
    notificationState.baContext = {
        locationName: baState.locationName || '',
        treatmentType: treatmentName || baState.treatmentType || '',
        treatmentDate: document.getElementById('baTreatmentDate')?.value || baState.treatmentDate,
        beforePeriod: {
            start: document.getElementById('baBeforeStart')?.value || '',
            end: document.getElementById('baBeforeEnd')?.value || ''
        },
        afterPeriod: {
            start: document.getElementById('baAfterStart')?.value || '',
            end: document.getElementById('baAfterEnd')?.value || ''
        },
        studyPeriodYears: baState.studyPeriodYears || 3,
        analysisMethod: baState.analysisMethod || 'eb',
        constructionDuration: baState.constructionDuration || 3,
        results: baState.results
    };
    openEmailNotificationModal('ba');
}

// Generate B/A PDF as base64 for email attachment (reuses downloadBAPDF logic)
function generateBAPDFForEmail() {
    if (!baState.results) return null;
    const r = baState.results;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const colors = {
        primary: [30, 64, 175],
        secondary: [124, 58, 237],
        success: [22, 163, 74],
        danger: [220, 38, 38],
        warning: [202, 138, 4],
        gray: [100, 116, 139],
        lightGray: [241, 245, 249]
    };

    const dateStamp = new Date().toISOString().slice(0, 10);
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect ? treatmentSelect.options[treatmentSelect.selectedIndex].text : (baState.treatmentType || 'Treatment');

    // Header
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Before & After Safety Study', margin, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${baState.locationName} | ${treatmentName}`, margin, 23);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Method: ${baState.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive'}`, margin, 30);

    let y = 45;

    // Summary Results
    doc.setTextColor(...colors.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Results', margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);

    const summaryData = [
        ['CMF (Crash Modification Factor)', r.cmf.toFixed(3)],
        ['CRF (Crash Reduction Factor)', r.crf.toFixed(1) + '%'],
        ['p-value', r.pValue.toFixed(4)],
        ['Statistically Significant', r.isSignificant ? 'Yes' : 'No'],
        ['Confidence Level', (r.confidenceLevel * 100).toFixed(0) + '%']
    ];

    summaryData.forEach(([label, value]) => {
        doc.text(label + ':', margin, y);
        doc.setFont('helvetica', 'bold');
        doc.text(value, margin + 70, y);
        doc.setFont('helvetica', 'normal');
        y += 6;
    });
    y += 5;

    // Crash Comparison Table
    doc.setTextColor(...colors.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Crash Comparison', margin, y);
    y += 8;

    const tableHeaders = ['Metric', 'Before', 'After', 'Change', '% Change'];
    const tableData = [
        ['Total Crashes', r.before.stats.total, r.after.stats.total],
        ['Fatal (K)', r.before.stats.K, r.after.stats.K],
        ['Serious Injury (A)', r.before.stats.A, r.after.stats.A],
        ['Other Injury (B+C)', r.before.stats.B + r.before.stats.C, r.after.stats.B + r.after.stats.C],
        ['PDO (O)', r.before.stats.O, r.after.stats.O],
        ['EPDO Score', calcEPDO(r.before.stats), calcEPDO(r.after.stats)]
    ];

    // Table header
    doc.setFillColor(...colors.lightGray);
    doc.rect(margin, y - 4, contentWidth, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    const colWidths = [50, 25, 25, 25, 30];
    let xPos = margin;
    tableHeaders.forEach((h, i) => {
        doc.text(h, xPos + 2, y);
        xPos += colWidths[i];
    });
    y += 7;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    tableData.forEach(([metric, before, after]) => {
        const change = after - before;
        const pctChange = before > 0 ? ((change / before) * 100).toFixed(1) + '%' : 'N/A';
        xPos = margin;
        doc.text(metric, xPos + 2, y);
        doc.text(before.toString(), xPos + colWidths[0] + 2, y);
        doc.text(after.toString(), xPos + colWidths[0] + colWidths[1] + 2, y);
        const changeColor = change < 0 ? colors.success : (change > 0 ? colors.danger : colors.gray);
        doc.setTextColor(...changeColor);
        doc.text((change >= 0 ? '+' : '') + change.toString(), xPos + colWidths[0] + colWidths[1] + colWidths[2] + 2, y);
        doc.text(pctChange, xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, y);
        doc.setTextColor(50, 50, 50);
        y += 6;
    });

    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.setFontSize(7);
        doc.setTextColor(...colors.gray);
        doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    const cleanLocation = (baState.locationName || 'Location').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
    const filename = `BA_Study_${cleanLocation}_${dateStamp}.pdf`;
    const base64 = doc.output('datauristring').split(',')[1];
    return { base64, filename, pageCount: totalPages };
}

// Test email for B/A reports
async function testBAEmailNotification(allRecipients) {
    const ba = notificationState.baContext;
    if (!ba || !ba.locationName) {
        showEmailError('No Before/After analysis context available');
        return;
    }

    const brevoSource = notificationState.preferences.brevo?.source || 'auto';
    const hasCoolifyBackend = brevoSource === 'auto';

    if (!hasCoolifyBackend) {
        const apiKey = document.getElementById('brevoApiKeyInput')?.value?.trim();
        const fromEmail = document.getElementById('brevoFromEmail')?.value?.trim();
        if (!apiKey || !fromEmail) {
            showBrevoToast('Email service not configured. Please contact your administrator.', 'error');
            return;
        }
    }

    const testBtn = document.getElementById('emailTestBtn');
    const resetTestBtn = () => {
        if (testBtn) { testBtn.disabled = false; testBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg> Send Test'; }
    };

    if (testBtn) { testBtn.disabled = true; testBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating B/A report...'; }

    const r = ba.results;
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
    const customMessage = document.getElementById('emailMessageInput')?.value?.trim() || '';
    const agency = document.getElementById('baEmailAgency')?.value?.trim() || '';
    const preparedBy = document.getElementById('baEmailPreparedBy')?.value?.trim() || '';

    // Generate B/A PDF
    let pdfAttachment = null;
    try {
        const pdfResult = generateBAPDFForEmail();
        if (pdfResult) {
            pdfAttachment = { content: pdfResult.base64, name: pdfResult.filename, _pageCount: pdfResult.pageCount };
        }
    } catch (pdfErr) {
        console.warn('[BA Email] PDF generation failed:', pdfErr.message);
    }

    // Build B/A email HTML
    const changeIcon = r.crf > 0 ? '&#8595;' : (r.crf < 0 ? '&#8593;' : '&#8596;');
    const changeColor = r.crf > 0 ? '#16a34a' : (r.crf < 0 ? '#dc2626' : '#64748b');
    const significanceLabel = r.isSignificant ? '<span style="color:#16a34a;font-weight:600">&#10003; Statistically Significant</span>' : '<span style="color:#92400e;font-weight:500">Not Statistically Significant</span>';

    function buildBAEmailHtml(recipientEmail) {
        const pageCountNote = pdfAttachment?._pageCount > 1 ? ` (${pdfAttachment._pageCount} pages)` : '';
        const customMessageHtml = customMessage ? `
            <div style="margin:20px 0;padding:16px 20px;background:#f8fafc;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0">
                <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;white-space:pre-wrap">${customMessage.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</p>
            </div>` : '';

        return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
        <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#0ea5e9 100%);padding:28px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px">CRASH LENS</h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;font-weight:500">Before/After Safety Study Report</p>
        </div>
        <div style="padding:28px 32px;background:#ffffff;border:1px solid #e2e8f0;border-top:none">
            <p style="color:#1e293b;font-size:15px;margin:0 0 20px;line-height:1.6">Your <strong>Before/After Study</strong> for <strong>${ba.locationName}</strong> is ready.</p>

            <!-- Key Results Card -->
            <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1.5px solid #7dd3fc;border-radius:10px;padding:20px;margin-bottom:20px">
                <h3 style="margin:0 0 14px;color:#0369a1;font-size:16px">Key Results</h3>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
                    <div style="flex:1;min-width:100px;background:white;border-radius:8px;padding:12px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:11px;color:#64748b;margin-bottom:4px">CMF</div>
                        <div style="font-size:20px;font-weight:700;color:#1e40af">${r.cmf.toFixed(3)}</div>
                    </div>
                    <div style="flex:1;min-width:100px;background:white;border-radius:8px;padding:12px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Crash Reduction</div>
                        <div style="font-size:20px;font-weight:700;color:${changeColor}">${changeIcon} ${Math.abs(r.crf).toFixed(1)}%</div>
                    </div>
                    <div style="flex:1;min-width:100px;background:white;border-radius:8px;padding:12px;text-align:center;border:1px solid #e2e8f0">
                        <div style="font-size:11px;color:#64748b;margin-bottom:4px">p-value</div>
                        <div style="font-size:20px;font-weight:700;color:#1e293b">${r.pValue.toFixed(4)}</div>
                    </div>
                </div>
                <div style="text-align:center;font-size:13px">${significanceLabel}</div>
            </div>

            <!-- Crash Comparison -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px">
                <tr style="background:#f1f5f9">
                    <th style="padding:8px 10px;text-align:left;color:#475569;font-weight:600;border-bottom:2px solid #e2e8f0">Metric</th>
                    <th style="padding:8px 10px;text-align:center;color:#991b1b;font-weight:600;border-bottom:2px solid #e2e8f0">Before</th>
                    <th style="padding:8px 10px;text-align:center;color:#166534;font-weight:600;border-bottom:2px solid #e2e8f0">After</th>
                    <th style="padding:8px 10px;text-align:center;color:#475569;font-weight:600;border-bottom:2px solid #e2e8f0">Change</th>
                </tr>
                <tr>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-weight:500">Total Crashes</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${r.before.stats.total}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${r.after.stats.total}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;color:${r.after.stats.total <= r.before.stats.total ? '#16a34a' : '#dc2626'}">${r.after.stats.total - r.before.stats.total >= 0 ? '+' : ''}${r.after.stats.total - r.before.stats.total}</td>
                </tr>
                <tr>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-weight:500">Fatal + Serious (KA)</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${r.before.stats.K + r.before.stats.A}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${r.after.stats.K + r.after.stats.A}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;color:${(r.after.stats.K + r.after.stats.A) <= (r.before.stats.K + r.before.stats.A) ? '#16a34a' : '#dc2626'}">${(r.after.stats.K + r.after.stats.A) - (r.before.stats.K + r.before.stats.A) >= 0 ? '+' : ''}${(r.after.stats.K + r.after.stats.A) - (r.before.stats.K + r.before.stats.A)}</td>
                </tr>
                <tr>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-weight:500">EPDO Score</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${calcEPDO(r.before.stats)}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${calcEPDO(r.after.stats)}</td>
                    <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;color:${calcEPDO(r.after.stats) <= calcEPDO(r.before.stats) ? '#16a34a' : '#dc2626'}">${calcEPDO(r.after.stats) - calcEPDO(r.before.stats) >= 0 ? '+' : ''}${calcEPDO(r.after.stats) - calcEPDO(r.before.stats)}</td>
                </tr>
            </table>

            ${pdfAttachment ? `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center">
                <div style="flex-shrink:0;width:40px;height:40px;background:#dcfce7;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:14px">
                    <span style="font-size:20px">&#128196;</span>
                </div>
                <div>
                    <p style="margin:0;color:#15803d;font-size:14px;font-weight:600">${pdfAttachment.name}${pageCountNote}</p>
                    <p style="margin:2px 0 0;color:#16a34a;font-size:12px">Full Before/After study PDF attached</p>
                </div>
            </div>` : ''}

            ${customMessageHtml}

            <div style="text-align:center;margin:24px 0 16px">
                <a href="https://crashlens.aicreatesai.com" target="_blank" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px">View Full Report in CRASH LENS</a>
            </div>

            <table style="width:100%;font-size:13px;border-collapse:collapse;margin-top:16px">
                <tr><td style="padding:10px 0;color:#64748b;width:130px;vertical-align:top">Location</td><td style="padding:10px 0;color:#1e293b;font-weight:500">${ba.locationName}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Treatment</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${ba.treatmentType}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Treatment Date</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${new Date(ba.treatmentDate).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Method</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${ba.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive'}</td></tr>
                ${agency ? `<tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Agency</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${agency}</td></tr>` : ''}
                ${preparedBy ? `<tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Prepared by</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${preparedBy}</td></tr>` : ''}
                <tr><td style="padding:10px 0;color:#64748b;border-top:1px solid #f1f5f9;vertical-align:top">Delivered</td><td style="padding:10px 0;color:#1e293b;border-top:1px solid #f1f5f9">${timestamp}</td></tr>
            </table>
        </div>
        <div style="padding:16px 32px;background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#94a3b8;font-size:11px;margin:0">This email was sent to ${recipientEmail}. You are receiving this because you subscribed to Before/After study notifications via CRASH LENS.</p>
        </div>
    </div>`;
    }

    // Send to each recipient
    let successCount = 0;
    let failCount = 0;
    const totalRecipients = allRecipients.length;

    for (let i = 0; i < totalRecipients; i++) {
        const recipientEmail = allRecipients[i];
        if (testBtn) {
            testBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending ${i + 1}/${totalRecipients}...`;
        }

        const emailHtml = buildBAEmailHtml(recipientEmail);
        const subject = `[CRASH LENS] Before/After Study: ${ba.locationName} \u2014 CMF ${r.cmf.toFixed(3)} (${r.crf > 0 ? '\u2193' : '\u2191'}${Math.abs(r.crf).toFixed(1)}%)`;
        const plainText = `CRASH LENS - Before/After Safety Study\nLocation: ${ba.locationName}\nTreatment: ${ba.treatmentType}\nCMF: ${r.cmf.toFixed(3)} | CRF: ${r.crf.toFixed(1)}%\nSignificant: ${r.isSignificant ? 'Yes' : 'No'}\n${customMessage ? 'Message: ' + customMessage + '\n' : ''}Sent: ${timestamp}`;

        try {
            let sent = false;
            if (hasCoolifyBackend) {
                try {
                    const payload = { to: [recipientEmail], subject, html: emailHtml, text: plainText };
                    if (pdfAttachment) payload.attachment = { content: pdfAttachment.content, name: pdfAttachment.name };
                    const resp = await fetch('/api/notify/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    if (resp.ok) sent = true;
                    else console.warn(`[BA Email] Coolify send failed for ${recipientEmail}: ${resp.status}`);
                } catch (err) {
                    console.warn(`[BA Email] Coolify backend unavailable:`, err.message);
                }
            }
            if (!sent) {
                const apiKey = document.getElementById('brevoApiKeyInput')?.value?.trim();
                const fromEmail = document.getElementById('brevoFromEmail')?.value?.trim();
                const fromName = document.getElementById('brevoFromName')?.value?.trim() || 'CRASH LENS';
                if (apiKey && fromEmail) {
                    const payload = { sender: { email: fromEmail, name: fromName }, to: [{ email: recipientEmail }], subject, htmlContent: emailHtml, tags: ['crash-lens', 'ba-study'] };
                    if (pdfAttachment) payload.attachment = [{ content: pdfAttachment.content, name: pdfAttachment.name }];
                    const resp = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': apiKey }, body: JSON.stringify(payload) });
                    if (resp.ok) sent = true;
                }
            }
            if (sent) successCount++;
            else failCount++;
        } catch (err) {
            console.error(`[BA Email] Error sending to ${recipientEmail}:`, err);
            failCount++;
        }
    }

    resetTestBtn();

    if (successCount > 0) {
        notificationState.history.push({ type: 'ba_test_sent', timestamp: new Date().toISOString(), details: `B/A report sent to ${successCount} recipient(s) for ${ba.locationName}` });
        saveNotificationPreferences();
        showBrevoToast(`Before/After report sent to ${successCount} recipient${successCount > 1 ? 's' : ''}!`, 'success');
    }
    if (failCount > 0) {
        showBrevoToast(`Failed to send to ${failCount} recipient${failCount > 1 ? 's' : ''}. Check console for details.`, 'error');
    }
}

// B/A delivery mode UI toggle
function updateBADeliveryModeUI() {
    const mode = document.querySelector('input[name="baDeliveryMode"]:checked')?.value || 'recurring';
    const recurringEl = document.getElementById('baRecurringScheduleOptions');
    if (recurringEl) recurringEl.style.display = mode === 'recurring' ? 'block' : 'none';
    // Update label styling
    document.querySelectorAll('input[name="baDeliveryMode"]').forEach(radio => {
        const label = radio.closest('label');
        if (label) {
            label.style.background = radio.checked ? '#dbeafe' : 'white';
            label.style.borderColor = radio.checked ? '#3b82f6' : '#e2e8f0';
        }
    });
}

// B/A frequency UI toggle
function updateBAFrequencyUI() {
    const freq = document.getElementById('baEmailFrequency')?.value || 'monthly';
    const weeklyEl = document.getElementById('baWeeklyDaySelect');
    const monthlyEl = document.getElementById('baMonthlyDaySelect');
    if (weeklyEl) weeklyEl.style.display = freq === 'weekly' ? 'block' : 'none';
    if (monthlyEl) monthlyEl.style.display = freq !== 'weekly' ? 'block' : 'none';
}

// Calculate next B/A delivery date
function calculateBANextDelivery() {
    const textEl = document.getElementById('baNextDeliveryText');
    if (!textEl) return;

    const freq = document.getElementById('baEmailFrequency')?.value || 'monthly';
    const time = document.getElementById('baReportTime')?.value || '08:00';
    const tz = document.getElementById('baNotifTimezone')?.selectedOptions?.[0]?.text || 'Eastern (ET)';

    const now = new Date();
    let next = new Date(now);
    const [hours, minutes] = time.split(':').map(Number);
    next.setHours(hours, minutes, 0, 0);

    if (freq === 'weekly') {
        const targetDay = parseInt(document.getElementById('baDayOfWeek')?.value || '1');
        const daysUntil = (targetDay - now.getDay() + 7) % 7 || 7;
        next.setDate(now.getDate() + daysUntil);
    } else {
        const targetDom = parseInt(document.getElementById('baDayOfMonth')?.value || '1');
        next.setDate(targetDom);
        if (next <= now) {
            if (freq === 'monthly') next.setMonth(next.getMonth() + 1);
            else if (freq === 'quarterly') next.setMonth(next.getMonth() + 3);
            else if (freq === 'annual') next.setFullYear(next.getFullYear() + 1);
        }
    }

    textEl.textContent = `Next delivery: ${next.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${time} ${tz}`;
}

// ============================================================
// B/A CRASH MONITORING & ALERT FUNCTIONS
// ============================================================

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.openBAEmailSchedule = openBAEmailSchedule; CL.reports.ba.openBAEmailSchedule = openBAEmailSchedule;
  window.generateBAPDFForEmail = generateBAPDFForEmail; CL.reports.ba.generateBAPDFForEmail = generateBAPDFForEmail;
  window.testBAEmailNotification = testBAEmailNotification; CL.reports.ba.testBAEmailNotification = testBAEmailNotification;
  window.updateBADeliveryModeUI = updateBADeliveryModeUI; CL.reports.ba.updateBADeliveryModeUI = updateBADeliveryModeUI;
  window.updateBAFrequencyUI = updateBAFrequencyUI; CL.reports.ba.updateBAFrequencyUI = updateBAFrequencyUI;
  window.calculateBANextDelivery = calculateBANextDelivery; CL.reports.ba.calculateBANextDelivery = calculateBANextDelivery;
  CL._registerModule('reports/report-ba-email');
})();
