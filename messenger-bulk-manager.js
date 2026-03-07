// --- Enhanced Output Logger Code (v2) ---
function createLogBox() {
    if (document.getElementById('archive-log-box')) return;
    const logBox = document.createElement('div');
    logBox.id = 'archive-log-box';
    Object.assign(logBox.style, {
        position: 'fixed', top: '20px', right: '20px', width: '350px', height: '90vh', maxHeight: '800px',
        backgroundColor: 'rgba(20, 20, 20, 0.95)', color: 'white', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)', zIndex: '9999', overflow: 'hidden',
        fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)'
    });
    const logHeader = document.createElement('div');
    Object.assign(logHeader.style, { padding: '8px 12px', backgroundColor: 'rgba(50,50,50,0.9)', fontWeight: 'bold' });
    logHeader.textContent = "Bulk Action Log";
    const logContent = document.createElement('div');
    logContent.id = 'archive-log-content';
    Object.assign(logContent.style, { padding: '8px 12px', height: 'calc(100% - 37px)', overflowY: 'auto' });
    logBox.appendChild(logHeader);
    logBox.appendChild(logContent);
    document.body.appendChild(logBox);
}

function logOutput(message, type = 'info') {
    createLogBox();
    const logContent = document.getElementById('archive-log-content');
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `<span style="color: #888;">${timestamp}:</span> ${message}`;
    if (type === 'error') entry.style.color = '#ff8a8a';
    if (type === 'success') entry.style.color = '#a0ff9a';
    if (type === 'warning') entry.style.color = '#ffd700';
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}
// --- End of Logger Code ---

// --- Custom HTML/CSS Modal ---
function showChatSelectorModal(chats) {
    return new Promise((resolve, reject) => {
        const modalStyles = `
            #bulk-action-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 10, 10, 0.7); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            #bulk-action-modal { background: #282a2d; color: #E4E6EB; border: 1px solid #555; width: 550px; max-height: 85vh; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
            #modal-header { padding: 20px; border-bottom: 1px solid #3E4042; text-align: center; }
            #modal-header h2 { margin: 0; font-size: 22px; font-weight: 600; }
            #modal-body { padding: 20px; overflow-y: auto; }
            #modal-body::-webkit-scrollbar { width: 8px; } #modal-body::-webkit-scrollbar-track { background: transparent; } #modal-body::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; } #modal-body::-webkit-scrollbar-thumb:hover { background: #777; }
            .chat-list-item { display: flex; align-items: center; margin-bottom: 8px; padding: 10px; border-radius: 8px; transition: background-color 0.2s ease; }
            .chat-list-item:hover { background-color: rgba(255, 255, 255, 0.1); }
            .chat-list-item input { margin-right: 15px; transform: scale(1.3); cursor: pointer; }
            .chat-list-item label { flex-grow: 1; cursor: pointer; }
            #modal-footer { padding: 20px; border-top: 1px solid #3E4042; display: flex; justify-content: space-between; align-items: center; background-color: #303235; }
            #selection-counter { font-size: 14px; color: #aaa; }
            .modal-btn { padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.2s ease; }
            .modal-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
            .action-btn { background-color: #007bff; color: white; } .action-btn:hover { background-color: #0069d9; }
            .danger-btn { background-color: #dc3545; color: white; } .danger-btn:hover { background-color: #c82333; }
            .secondary-btn { background-color: #6c757d; color: white; } .secondary-btn:hover { background-color: #5a6268; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.id = 'bulk-modal-styles';
        styleSheet.innerText = modalStyles;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.id = 'bulk-action-overlay';
        
        const chatItemsHTML = chats.map((chat, index) => `
            <div class="chat-list-item">
                <input type="checkbox" class="chat-checkbox" id="chat-${index}" value="${index}">
                <label for="chat-${index}">${chat.displayName}</label>
            </div>
        `).join('');

        overlay.innerHTML = `
            <div id="bulk-action-modal">
                <div id="modal-header"><h2>Bulk Chat Processor</h2></div>
                <div id="modal-body">
                    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                        <button id="select-all-btn" class="secondary-btn">Select All</button>
                        <button id="deselect-all-btn" class="secondary-btn">Deselect All</button>
                    </div>
                    ${chatItemsHTML}
                </div>
                <div id="modal-footer">
                    <span id="selection-counter">0 items selected</span>
                    <div>
                        <button id="cancel-btn" class="secondary-btn" style="margin-right: 10px;">Cancel</button>
                        <button id="archive-btn" class="action-btn" style="margin-right: 10px;">Archive Selected</button>
                        <button id="delete-btn" class="danger-btn">Delete Selected</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const updateCounter = () => {
            const count = document.querySelectorAll('.chat-checkbox:checked').length;
            document.getElementById('selection-counter').textContent = `${count} item(s) selected`;
        };

        const cleanup = () => {
            document.getElementById('bulk-action-overlay').remove();
            document.getElementById('bulk-modal-styles').remove();
        };

        const handleAction = (action) => {
            const selectedChats = [];
            document.querySelectorAll('.chat-checkbox:checked').forEach(checkbox => {
                selectedChats.push(chats[parseInt(checkbox.value)]);
            });
            if (selectedChats.length === 0) {
                alert("Please select at least one chat.");
                return;
            }
            if (action === 'delete') {
                if (!confirm(`Are you sure you want to permanently DELETE ${selectedChats.length} chat(s)? This cannot be undone.`)) {
                    return;
                }
            }
            cleanup();
            resolve({ action, selectedChats });
        };
        
        document.querySelectorAll('.chat-checkbox').forEach(cb => cb.onchange = updateCounter);
        document.getElementById('select-all-btn').onclick = () => { document.querySelectorAll('.chat-checkbox').forEach(cb => cb.checked = true); updateCounter(); };
        document.getElementById('deselect-all-btn').onclick = () => { document.querySelectorAll('.chat-checkbox').forEach(cb => cb.checked = false); updateCounter(); };
        document.getElementById('archive-btn').onclick = () => handleAction('archive');
        document.getElementById('delete-btn').onclick = () => handleAction('delete');
        document.getElementById('cancel-btn').onclick = () => { cleanup(); reject('User cancelled'); };
    });
}

async function startBulkAction() {
    logOutput("Starting Bulk Action Script v15...", "success");

    // --- CONFIGURATION ---
    const DELAY_BETWEEN_ACTIONS = 1000; // Time in milliseconds (e.g., 1000 = 1 second)
    // -------------------

    const DYNAMIC_MENU_SELECTOR = 'div[aria-label^="More options for"]';
    
    const chatlist = document.querySelector('div[aria-label="Chats"]');
    if (!chatlist) {
        logOutput("Fatal Error: Could not find the main 'Chats' list.", 'error');
        return;
    }
    logOutput("Scanning chat list...");

    const allChats = [];
    const menuElements = chatlist.querySelectorAll(DYNAMIC_MENU_SELECTOR);
    menuElements.forEach(menu => {
        allChats.push({
            displayName: menu.getAttribute('aria-label').replace('More options for', '').trim(),
            chatListItemElement: menu.closest('div[role="listitem"]'),
            menuElement: menu
        });
    });
    
    if (allChats.length === 0) {
        logOutput("No chats found to process.", "warning");
        return;
    }
    logOutput(`Found ${allChats.length} chats. Opening selection dialog...`, "success");

    let actionResult;
    try {
        actionResult = await showChatSelectorModal(allChats);
    } catch (error) {
        logOutput(error, 'warning');
        return;
    }
    
    const { action, selectedChats } = actionResult;
    logOutput(`User chose to ${action.toUpperCase()} ${selectedChats.length} chats. Starting process...`, "warning");

    function waitForElementToBeRemoved(elementToWatch) {
        return new Promise(resolve => {
            if (!elementToWatch) { resolve(); return; }
            logOutput("Waiting for UI to update...", "warning");
            const interval = setInterval(() => {
                if (!document.body.contains(elementToWatch)) {
                    clearInterval(interval);
                    logOutput("UI has updated.", "success");
                    resolve();
                }
            }, 250);
        });
    }

    for (const [index, chat] of selectedChats.entries()) {
        logOutput(`[${index + 1}/${selectedChats.length}] Action: ${action.toUpperCase()} on "${chat.displayName}"`);
        
        if (!document.body.contains(chat.menuElement)) {
            logOutput(` -> Error: Chat element for "${chat.displayName}" is no longer on the page. Skipping.`, "error");
            continue;
        }

        chat.menuElement.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        const initialActionText = action === 'archive' ? /^Archive chat$/i : /^Delete chat$/i;
        let foundAndClicked = false;
        const menuitems = document.querySelectorAll('div[role="menuitem"]');
        for (const item of menuitems) {
            if (initialActionText.test(item.innerText)) {
                logOutput(` -> Clicked '${item.innerText}' button.`, 'success');
                item.click();
                foundAndClicked = true;
                break;
            }
        }
        
        if (foundAndClicked) {
            if (action === 'delete') {
                logOutput("Searching for final 'Delete chat' confirmation button...", "warning");
                await new Promise(resolve => setTimeout(resolve, 500));
                
                let finalDeleteButtonFound = false;
                const buttonsInDialog = document.querySelectorAll('[role="dialog"] [role="button"]');
                for (const btn of buttonsInDialog) {
                    if (btn.innerText.trim() === "Delete chat") {
                        logOutput(" -> Found and clicked final confirmation button.", 'success');
                        btn.click();
                        finalDeleteButtonFound = true;
                        break;
                    }
                }
                if (!finalDeleteButtonFound) logOutput(" -> WARNING: Could not auto-click final delete confirmation.", "error");
            }
            await waitForElementToBeRemoved(chat.chatListItemElement);
        } else {
            logOutput(` -> Error: Could not find '${action}' button for "${chat.displayName}".`, 'error');
        }

        // Wait before processing the next chat, but not after the very last one.
        if (index < selectedChats.length - 1) {
            logOutput(`Waiting for ${DELAY_BETWEEN_ACTIONS / 1000} seconds before next action...`, "warning");
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_ACTIONS));
        }
    }

    logOutput(`Finished!`, 'success');
}

startBulkAction();
