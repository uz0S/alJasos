async function startGame() {
    const loader = document.getElementById('ai-loading');
    const btn = document.getElementById('start-btn');
    loader.style.display = 'block';
    btn.style.display = 'none';

    spyIndex = Math.floor(Math.random() * players.length);
    const category = document.getElementById('category').value;
    
    // جلب الكلمة من Gemini
    try {
        const prompt = `أعطني اسم شيء واحد فقط ينتمي لفئة ${category} باللغة العربية، بدون شرح، كلمة واحدة فقط.`;
        
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            // تمت إضافة الـ Headers هنا
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        // التحقق من نجاح الطلب
        if (!res.ok) {
            throw new Error(`خطأ في الاتصال: ${res.status}`);
        }

        const data = await res.json();
        
        // التحقق من وجود رد صالح من الذكاء الاصطناعي
        if (data.candidates && data.candidates.length > 0) {
            currentWord = data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("لم يتم إرجاع كلمة صحيحة");
        }

    } catch (error) {
        console.error("حدث خطأ أثناء جلب الكلمة:", error);
        currentWord = "حديقة"; // الكلمة البديلة في حال فشل الذكاء الاصطناعي
    }

    loader.style.display = 'none';
    btn.style.display = 'block';
    currentPlayerIndex = 0;
    startPassing();
}
