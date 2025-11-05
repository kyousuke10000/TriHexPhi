-- LINE macOS Scroll Export
-- Purpose: Scroll to top and copy all messages
-- Run: osascript line_mac_scroll_export.applescript

on run argv
    set groupName to "ツクツク徳之島チーム"
    set maxScrolls to 25
    set idleThreshold to 5
    set progressFile to POSIX path of (do shell script "pwd") & "/artifacts/line_export/metadata.json"
    
    -- Initialize progress tracking
    set scrollCount to 0
    set idleCount to 0
    set lastTextLength to 0
    
    tell application "System Events"
        tell application "LINE" to activate
        delay 2
        
        -- Search for group
        keystroke "f" using {command down}
        delay 1
        keystroke groupName
        delay 1
        key code 36 -- Return
        delay 2
        
        -- Scroll to top
        repeat with i from 1 to 100
            key code 116 -- Page Up
            delay 0.5
            
            -- Check if at top
            try
                keystroke "a" using {command down}
                delay 0.2
                set clipboard to ""
                keystroke "c" using {command down}
                delay 0.3
                set currentText to (do shell script "pbpaste")
                set currentLength to length of currentText
                
                if currentLength > lastTextLength then
                    set idleCount to 0
                    set lastTextLength to currentLength
                else
                    set idleCount to idleCount + 1
                    if idleCount ≥ idleThreshold then
                        exit repeat
                    end if
                end if
                
                -- Save progress
                do shell script "echo '{\"scrolls\":" & scrollCount & ",\"last_length\":" & currentLength & "}' > " & progressFile
                
            end try
            
            set scrollCount to scrollCount + 1
            if scrollCount ≥ maxScrolls then
                exit repeat
            end if
        end repeat
        
        -- Final copy
        keystroke "a" using {command down}
        delay 0.5
        keystroke "c" using {command down}
        delay 1
        
        -- Save to file
        do shell script "pbpaste > artifacts/line_export/chat_raw.txt"
        
        return "Scroll complete: " & scrollCount & " scrolls, " & lastTextLength & " chars"
    end tell
end run

