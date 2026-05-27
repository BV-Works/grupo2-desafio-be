export const getPredictionsFromML = async (payload) => {
    const res = await fetch(`${process.env.ML_API_URL}/predict/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('ML RAW ERROR:', errorText);
        throw new Error(`ML API Error: ${res.status}`);
    }

    return res.json();
};