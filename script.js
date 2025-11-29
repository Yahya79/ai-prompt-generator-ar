// دالة التحكم في إظهار وإخفاء حقول الإدخال
function toggleFields() {
    // 1. تحديد الإطار المختار من أزرار الراديو
    const selectedRadio = document.querySelector('.framework-selector-buttons input[name="framework"]:checked');
    const selectedFramework = selectedRadio ? selectedRadio.value : '';

    // 2. تحديث الحقل المخفي بالقيمة المختارة 
    document.getElementById('frameworkValueHolder').value = selectedFramework;

    // 3. إخفاء جميع الحقول أولاً
    const allFields = document.querySelectorAll('#promptForm .form-group');
    allFields.forEach(field => {
        field.classList.remove('visible-field');
        field.classList.add('hidden-field');
    });

    // 4. إظهار الحقول التي تتطابق مع الإطار المختار
    if (selectedFramework) {
        const fieldsToShow = document.querySelectorAll(`[data-frameworks*="${selectedFramework}"]`);
        fieldsToShow.forEach(field => {
            field.classList.remove('hidden-field');
            field.classList.add('visible-field');
        });
    }
}

// دالة توليد الأمر الاحترافي (خالٍ من الرموز)
function generatePrompt() {
    const framework = document.getElementById('frameworkValueHolder').value; 
    let promptText = "";
    
    if (!framework) {
        alert("الرجاء اختيار إطار العمل أولاً.");
        return;
    }

    // دالة مساعدة تأخذ التسمية الكاملة للحقل
    const addField = (id, fullLabel) => {
        const value = document.getElementById(id).value.trim();
        if (value) {
            // تنسيق احترافي بدون رموز: العنوان يليه سطر فارغ ثم القيمة
            promptText += `\n${fullLabel}:\n${value}\n`; 
        }
    };

    // إضافة مقدمة الإطار
    let frameworkTitle = "";
    if (framework === 'ICDF') {
        frameworkTitle = "المهمة المطلوبة (بناءً على إطار ICDF - للتحليل والبيانات):";
        promptText += frameworkTitle;
        addField('request', 'التعليمات');
        addField('context', 'السياق والخلفية');
        addField('data', 'البيانات');
        addField('formatOutput', 'التنسيق والشكل النهائي');
    } else if (framework === 'RCREOC') {
        frameworkTitle = "المهمة المطلوبة (بناءً على إطار RCR EOC - كوكيل أو خبير):";
        promptText += frameworkTitle;
        addField('role', 'الدور أو الشخصية');
        addField('context', 'السياق والخلفية');
        addField('request', 'الطلب والتعليمات الأساسية');
        addField('examples', 'الأمثلة لتوضيح النتيجة');
        addField('constraints', 'القيود أو الإجراء المطلوب');
        addField('formatOutput', 'التنسيق والشكل النهائي');
    } else if (framework === 'MICRO') {
        frameworkTitle = "المهمة المطلوبة (بناءً على إطار MICRO - للمحتوى الإبداعي):";
        promptText += frameworkTitle;
        addField('message', 'الرسالة الجوهرية');
        addField('intention', 'الهدف من المحتوى');
        addField('context', 'السياق والجمهور');
        addField('rhythmStyle', 'الإيقاع والأسلوب');
        addField('formatOutput', 'التنسيق والشكل النهائي');
    } else if (framework === 'COSTAR') {
        frameworkTitle = "المهمة المطلوبة (بناءً على إطار COSTAR - للتسويق المباشر):";
        promptText += frameworkTitle;
        addField('context', 'السياق والخلفية');
        addField('offer', 'العرض أو المنتج');
        addField('styleCostar', 'الأسلوب التسويقي');
        addField('target', 'الجمهور المستهدف');
        addField('constraints', 'الإجراء المطلوب'); 
        addField('result', 'النتيجة المرجوة من الحملة');
        addField('formatOutput', 'التنسيق والشكل النهائي');
    }
    
    // إضافة فاصل احترافي
    promptText += "\n----------------------------------------\n";


    document.getElementById('generatedPrompt').value = promptText.trim();
}

// 1. وظيفة النسخ (Copy)
function copyPrompt() {
    const promptArea = document.getElementById('generatedPrompt');
    if (promptArea.value.trim() === "") {
        alert("لا يوجد أمر لنسخه.");
        return;
    }
    promptArea.select(); 
    document.execCommand('copy'); 
    alert("تم نسخ الأمر الاحترافي بنجاح!");
}

// 2. وظيفة المسح (Clear)
function clearForm() {
    if (confirm("هل أنت متأكد من مسح جميع المدخلات والمخرجات؟")) {
        document.getElementById('promptForm').reset();
        document.getElementById('generatedPrompt').value = "";
        
        // مسح اختيار الراديو وإعادة تعيين الحقل المخفي
        const radioButtons = document.querySelectorAll('.framework-selector-buttons input[name="framework"]');
        radioButtons.forEach(radio => radio.checked = false);
        document.getElementById('frameworkValueHolder').value = "";

        toggleFields(); 
    }
}

// 3. وظيفة التصدير (Export as TXT)
function exportPrompt() {
    const promptText = document.getElementById('generatedPrompt').value;
    if (promptText.trim() === "") {
        alert("لا يوجد أمر لتصديره.");
        return;
    }
    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Prompt_Export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 4. وظيفة الطباعة (Print)
function printPrompt() {
    const promptText = document.getElementById('generatedPrompt').value;
    if (promptText.trim() === "") {
        alert("لا يوجد أمر لطباعته.");
        return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>طباعة الأمر</title>');
    printWindow.document.write('</head><body dir="rtl" style="font-family: Cairo, Arial, sans-serif; padding: 20px;">');
    printWindow.document.write('<h2>الأمر الاحترافي المُجهز</h2>');
    // إزالة رموز التنسيق من الطباعة أيضاً
    printWindow.document.write('<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 16px;">' + promptText + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// 5. وظيفة المشاركة (Share)
function sharePrompt() {
    const promptText = document.getElementById('generatedPrompt').value;
    if (promptText.trim() === "") {
        alert("لا يوجد أمر لمشاركته.");
        return;
    }

    if (navigator.share) {
        navigator.share({
            title: 'الأمر الاحترافي للذكاء الاصطناعي',
            text: promptText,
        }).then(() => {
            console.log('تمت المشاركة بنجاح!');
        }).catch(error => {
            console.log('فشلت المشاركة:', error);
        });
    } else {
        copyPrompt();
        alert("ميزة المشاركة غير مدعومة في متصفحك. تم نسخ الأمر إلى الحافظة بدلاً من ذلك.");
    }
}

// التشغيل عند تحميل الصفحة
window.onload = toggleFields;