
const { exec } = require('child_process');

const PORT = 5003;

const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${PORT}`
    : `lsof -i :${PORT} | grep LISTEN`;

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.log(`No process found on port ${PORT}`);
        return;
    }

    const lines = stdout.trim().split('\n');
    console.log(`Found ${lines.length} lines for port ${PORT}`);

    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        // On Windows: TCP 0.0.0.0:5002 0.0.0.0:0 LISTENING <PID>
        const pid = parts[parts.length - 1];

        if (pid && /^\d+$/.test(pid)) {
            console.log(`Killing PID: ${pid}`);
            exec(`taskkill /F /PID ${pid}`, (kErr, kOut, kStderr) => {
                if (kErr) console.error(`Failed to kill ${pid}:`, kErr.message);
                else console.log(`Successfully killed ${pid}`);
            });
        }
    });
});
