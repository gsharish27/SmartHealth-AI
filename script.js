/**
 * MediPulse - Smart Health Monitoring System
 * Complete Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Theme Toggle (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Load stored theme or default to light
    const currentTheme = localStorage.getItem('medipulse-theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('medipulse-theme', newTheme);
            
            if (themeIcon) {
                themeIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            }
            
            showToast(isDark ? 'Switched to Light Mode' : 'Switched to Dark Mode', 'fa-solid fa-circle-half-stroke');
        });
    }

    /* ==========================================================================
       2. Mobile Navigation Hamburger Menu
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            hamburgerBtn.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       3. Live Vitals Telemetry Simulator (Dashboard)
       ========================================================================== */
    let simulationRunning = true;
    let simulationInterval = null;
    
    // State metrics baseline values
    const vitalsState = {
        heartRate: 72,
        bpSystolic: 120,
        bpDiastolic: 80,
        temperatureF: 98.6,
        tempUnit: 'F', // 'F' or 'C'
        spo2: 98,
        sugar: 95,
        sugarState: 'Fasting' // 'Fasting' or 'Post-Meal'
    };

    // DOM Elements for Vitals
    const elHeartRate = document.getElementById('val-heart-rate');
    const badgeHeartRate = document.getElementById('badge-heart-rate');
    const barHeartRate = document.getElementById('bar-heart-rate');

    const elBp = document.getElementById('val-bp');
    const badgeBp = document.getElementById('badge-bp');
    const barBp = document.getElementById('bar-bp');

    const elTemp = document.getElementById('val-temp');
    const badgeTemp = document.getElementById('badge-temp');
    const barTemp = document.getElementById('bar-temp');
    const tempUnitToggle = document.getElementById('temp-unit-toggle');
    const unitTempLabel = document.getElementById('unit-temp-label');
    const tempRangeText = document.getElementById('temp-range-text');

    const elSpo2 = document.getElementById('val-spo2');
    const badgeSpo2 = document.getElementById('badge-spo2');
    const barSpo2 = document.getElementById('bar-spo2');

    const elSugar = document.getElementById('val-sugar');
    const badgeSugar = document.getElementById('badge-sugar');
    const barSugar = document.getElementById('bar-sugar');
    const sugarStateToggle = document.getElementById('sugar-state-toggle');
    const sugarRangeText = document.getElementById('sugar-range-text');

    const overallScoreEl = document.getElementById('overall-score');
    const scoreBarEl = document.getElementById('score-bar');
    const lastUpdatedEl = document.getElementById('last-updated-time');
    const vitalsLogBody = document.getElementById('vitals-log-body');

    const toggleSimBtn = document.getElementById('toggle-simulation-btn');
    const manualRefreshBtn = document.getElementById('manual-refresh-btn');
    const liveDot = document.getElementById('live-dot');
    const simStatusText = document.getElementById('simulation-status-text');

    // Helper: Random float/int generator
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max, decimals = 1) {
        const val = Math.random() * (max - min) + min;
        return parseFloat(val.toFixed(decimals));
    }

    // Function to simulate dynamic vital sign shifts
    function updateVitalsData() {
        // 1. Heart Rate fluctuation (62 - 94 BPM)
        vitalsState.heartRate = Math.min(100, Math.max(60, vitalsState.heartRate + getRandomInt(-3, 3)));
        elHeartRate.textContent = vitalsState.heartRate;
        barHeartRate.style.width = `${Math.min(100, (vitalsState.heartRate / 120) * 100)}%`;

        if (vitalsState.heartRate > 90) {
            badgeHeartRate.className = 'badge badge-warning';
            badgeHeartRate.textContent = 'Elevated';
        } else if (vitalsState.heartRate < 60) {
            badgeHeartRate.className = 'badge badge-warning';
            badgeHeartRate.textContent = 'Low';
        } else {
            badgeHeartRate.className = 'badge badge-success';
            badgeHeartRate.textContent = 'Normal';
        }

        // 2. Blood Pressure fluctuation
        vitalsState.bpSystolic = Math.min(135, Math.max(110, vitalsState.bpSystolic + getRandomInt(-2, 2)));
        vitalsState.bpDiastolic = Math.min(88, Math.max(72, vitalsState.bpDiastolic + getRandomInt(-2, 2)));
        elBp.textContent = `${vitalsState.bpSystolic}/${vitalsState.bpDiastolic}`;
        barBp.style.width = `${Math.min(100, (vitalsState.bpSystolic / 140) * 100)}%`;

        if (vitalsState.bpSystolic >= 130 || vitalsState.bpDiastolic >= 85) {
            badgeBp.className = 'badge badge-warning';
            badgeBp.textContent = 'Prehypertension';
        } else {
            badgeBp.className = 'badge badge-success';
            badgeBp.textContent = 'Optimal';
        }

        // 3. Body Temperature fluctuation
        vitalsState.temperatureF = parseFloat(Math.min(99.4, Math.max(97.6, vitalsState.temperatureF + getRandomFloat(-0.2, 0.2))).toFixed(1));
        
        if (vitalsState.tempUnit === 'F') {
            elTemp.textContent = vitalsState.temperatureF;
        } else {
            const tempC = ((vitalsState.temperatureF - 32) * 5 / 9).toFixed(1);
            elTemp.textContent = tempC;
        }

        barTemp.style.width = `${Math.min(100, ((vitalsState.temperatureF - 95) / 7) * 100)}%`;

        if (vitalsState.temperatureF > 99.0) {
            badgeTemp.className = 'badge badge-warning';
            badgeTemp.textContent = 'Mild Temp';
        } else {
            badgeTemp.className = 'badge badge-success';
            badgeTemp.textContent = 'Normal';
        }

        // 4. SpO2 Blood Oxygen fluctuation (96% - 100%)
        vitalsState.spo2 = Math.min(100, Math.max(95, vitalsState.spo2 + getRandomInt(-1, 1)));
        elSpo2.textContent = vitalsState.spo2;
        barSpo2.style.width = `${vitalsState.spo2}%`;

        if (vitalsState.spo2 < 95) {
            badgeSpo2.className = 'badge badge-warning';
            badgeSpo2.textContent = 'Below Avg';
        } else {
            badgeSpo2.className = 'badge badge-success';
            badgeSpo2.textContent = 'Optimal';
        }

        // 5. Blood Sugar Glucose
        const sugarMin = vitalsState.sugarState === 'Fasting' ? 70 : 110;
        const sugarMax = vitalsState.sugarState === 'Fasting' ? 105 : 145;
        vitalsState.sugar = Math.min(sugarMax, Math.max(sugarMin, vitalsState.sugar + getRandomInt(-3, 3)));
        elSugar.textContent = vitalsState.sugar;
        barSugar.style.width = `${Math.min(100, (vitalsState.sugar / 160) * 100)}%`;

        if (vitalsState.sugarState === 'Fasting') {
            if (vitalsState.sugar > 100) {
                badgeSugar.className = 'badge badge-warning';
                badgeSugar.textContent = 'High Fasting';
            } else {
                badgeSugar.className = 'badge badge-success';
                badgeSugar.textContent = 'Normal Fasting';
            }
        } else {
            if (vitalsState.sugar > 140) {
                badgeSugar.className = 'badge badge-warning';
                badgeSugar.textContent = 'High Post-Meal';
            } else {
                badgeSugar.className = 'badge badge-success';
                badgeSugar.textContent = 'Normal Post-Meal';
            }
        }

        // Overall Score Calculation (92 - 99)
        const overallScore = Math.min(99, Math.max(90, 96 + getRandomInt(-2, 2)));
        if (overallScoreEl) overallScoreEl.textContent = `${overallScore} / 100`;
        if (scoreBarEl) scoreBarEl.style.width = `${overallScore}%`;

        // Timestamp update
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (lastUpdatedEl) lastUpdatedEl.textContent = timeStr;

        // Log entry insertion
        addLogEntry(timeStr);
    }

    // Function to add row to telemetry table
    function addLogEntry(timestamp) {
        if (!vitalsLogBody) return;

        const metrics = ['Heart Rate', 'Blood Pressure', 'Body Temp', 'SpO₂ Oxygen', 'Blood Sugar'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        let valueStr = '';
        let statusBadge = '<span class="badge badge-success">Normal</span>';

        switch (randomMetric) {
            case 'Heart Rate':
                valueStr = `${vitalsState.heartRate} BPM`;
                break;
            case 'Blood Pressure':
                valueStr = `${vitalsState.bpSystolic}/${vitalsState.bpDiastolic} mmHg`;
                break;
            case 'Body Temp':
                valueStr = vitalsState.tempUnit === 'F' ? `${vitalsState.temperatureF}°F` : `${((vitalsState.temperatureF-32)*5/9).toFixed(1)}°C`;
                break;
            case 'SpO₂ Oxygen':
                valueStr = `${vitalsState.spo2}%`;
                break;
            case 'Blood Sugar':
                valueStr = `${vitalsState.sugar} mg/dL (${vitalsState.sugarState})`;
                break;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><i class="fa-regular fa-clock color-blue"></i> ${timestamp}</td>
            <td><strong>${randomMetric}</strong></td>
            <td>${valueStr}</td>
            <td>${statusBadge}</td>
        `;

        vitalsLogBody.insertBefore(tr, vitalsLogBody.firstChild);

        // Keep maximum 8 log entries
        while (vitalsLogBody.children.length > 8) {
            vitalsLogBody.removeChild(vitalsLogBody.lastChild);
        }
    }

    // Start Simulation Timer
    function startSimulation() {
        if (simulationInterval) clearInterval(simulationInterval);
        simulationInterval = setInterval(updateVitalsData, 3000);
        simulationRunning = true;
        
        if (toggleSimBtn) {
            toggleSimBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Updates';
        }
        if (liveDot) liveDot.className = 'status-dot live';
        if (simStatusText) simStatusText.textContent = 'Simulating Live Data';
    }

    function stopSimulation() {
        if (simulationInterval) clearInterval(simulationInterval);
        simulationRunning = false;
        
        if (toggleSimBtn) {
            toggleSimBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume Updates';
        }
        if (liveDot) liveDot.className = 'status-dot paused';
        if (simStatusText) simStatusText.textContent = 'Simulation Paused';
    }

    if (toggleSimBtn) {
        toggleSimBtn.addEventListener('click', () => {
            if (simulationRunning) {
                stopSimulation();
                showToast('Telemetry Updates Paused', 'fa-solid fa-pause');
            } else {
                startSimulation();
                showToast('Telemetry Updates Resumed', 'fa-solid fa-play');
            }
        });
    }

    if (manualRefreshBtn) {
        manualRefreshBtn.addEventListener('click', () => {
            updateVitalsData();
            showToast('Vitals Refreshed', 'fa-solid fa-rotate');
        });
    }

    // Temperature Unit Toggle (°F / °C)
    if (tempUnitToggle) {
        tempUnitToggle.addEventListener('click', () => {
            if (vitalsState.tempUnit === 'F') {
                vitalsState.tempUnit = 'C';
                tempUnitToggle.textContent = '°C';
                if (unitTempLabel) unitTempLabel.textContent = '°C';
                if (tempRangeText) tempRangeText.textContent = '36.1°C - 37.2°C';
            } else {
                vitalsState.tempUnit = 'F';
                tempUnitToggle.textContent = '°F';
                if (unitTempLabel) unitTempLabel.textContent = '°F';
                if (tempRangeText) tempRangeText.textContent = '97.0°F - 99.0°F';
            }
            updateVitalsData();
        });
    }

    // Sugar State Toggle (Fasting / Post-Meal)
    if (sugarStateToggle) {
        sugarStateToggle.addEventListener('click', () => {
            if (vitalsState.sugarState === 'Fasting') {
                vitalsState.sugarState = 'Post-Meal';
                sugarStateToggle.textContent = 'Post-Meal';
                if (sugarRangeText) sugarRangeText.textContent = '< 140 mg/dL';
                vitalsState.sugar = 125;
            } else {
                vitalsState.sugarState = 'Fasting';
                sugarStateToggle.textContent = 'Fasting';
                if (sugarRangeText) sugarRangeText.textContent = '70 - 99 mg/dL';
                vitalsState.sugar = 95;
            }
            updateVitalsData();
        });
    }

    // Initial run & start interval
    updateVitalsData();
    startSimulation();

    /* ==========================================================================
       4. BMI Calculator Logic
       ========================================================================== */
    let currentBmiUnit = 'metric'; // 'metric' or 'imperial'

    const unitMetricBtn = document.getElementById('unit-metric');
    const unitImperialBtn = document.getElementById('unit-imperial');

    const heightMetricGroup = document.getElementById('height-metric-group');
    const heightImperialGroup = document.getElementById('height-imperial-group');
    const heightCmInput = document.getElementById('height-cm');
    const heightCmRange = document.getElementById('height-cm-range');
    const heightCmValText = document.getElementById('height-cm-val');

    const heightFtInput = document.getElementById('height-ft');
    const heightInInput = document.getElementById('height-in');

    const weightInput = document.getElementById('weight');
    const weightRange = document.getElementById('weight-range');
    const weightValText = document.getElementById('weight-val');
    const weightUnitLabel = document.getElementById('weight-unit-label');

    const btnCalcBmi = document.getElementById('btn-calc-bmi');
    const btnResetBmi = document.getElementById('btn-reset-bmi');

    const bmiScoreText = document.getElementById('bmi-score-text');
    const bmiCategoryBadge = document.getElementById('bmi-category-badge');
    const bmiCircle = document.getElementById('bmi-circle');
    const bmiPointer = document.getElementById('bmi-pointer');
    const bmiAdviceText = document.getElementById('bmi-advice-text');

    // Unit toggle handlers
    if (unitMetricBtn && unitImperialBtn) {
        unitMetricBtn.addEventListener('click', () => {
            currentBmiUnit = 'metric';
            unitMetricBtn.classList.add('active');
            unitImperialBtn.classList.remove('active');

            heightMetricGroup.classList.remove('hidden');
            heightImperialGroup.classList.add('hidden');
            if (weightUnitLabel) weightUnitLabel.textContent = 'kg';

            // Convert current weight to kg if switching
            weightInput.value = 68;
            weightRange.value = 68;
            weightRange.min = 10;
            weightRange.max = 200;
            if (weightValText) weightValText.textContent = '68 kg';
            calculateBMI();
        });

        unitImperialBtn.addEventListener('click', () => {
            currentBmiUnit = 'imperial';
            unitImperialBtn.classList.add('active');
            unitMetricBtn.classList.remove('active');

            heightMetricGroup.classList.add('hidden');
            heightImperialGroup.classList.remove('hidden');
            if (weightUnitLabel) weightUnitLabel.textContent = 'lbs';

            // Set imperial weight defaults
            weightInput.value = 150;
            weightRange.value = 150;
            weightRange.min = 20;
            weightRange.max = 440;
            if (weightValText) weightValText.textContent = '150 lbs';
            calculateBMI();
        });
    }

    // Sync Height Slider & Number Input (Metric)
    if (heightCmInput && heightCmRange) {
        heightCmInput.addEventListener('input', () => {
            heightCmRange.value = heightCmInput.value;
            if (heightCmValText) heightCmValText.textContent = `${heightCmInput.value} cm`;
            calculateBMI();
        });

        heightCmRange.addEventListener('input', () => {
            heightCmInput.value = heightCmRange.value;
            if (heightCmValText) heightCmValText.textContent = `${heightCmRange.value} cm`;
            calculateBMI();
        });
    }

    // Sync Height Imperial Inputs
    if (heightFtInput && heightInInput) {
        heightFtInput.addEventListener('input', calculateBMI);
        heightInInput.addEventListener('input', calculateBMI);
    }

    // Sync Weight Slider & Number Input
    if (weightInput && weightRange) {
        weightInput.addEventListener('input', () => {
            weightRange.value = weightInput.value;
            const unit = currentBmiUnit === 'metric' ? 'kg' : 'lbs';
            if (weightValText) weightValText.textContent = `${weightInput.value} ${unit}`;
            calculateBMI();
        });

        weightRange.addEventListener('input', () => {
            weightInput.value = weightRange.value;
            const unit = currentBmiUnit === 'metric' ? 'kg' : 'lbs';
            if (weightValText) weightValText.textContent = `${weightRange.value} ${unit}`;
            calculateBMI();
        });
    }

    // Calculate BMI Core Function
    function calculateBMI() {
        let bmi = 0;

        if (currentBmiUnit === 'metric') {
            const hCm = parseFloat(heightCmInput.value) || 170;
            const wKg = parseFloat(weightInput.value) || 68;
            if (hCm > 0) {
                const hMeters = hCm / 100;
                bmi = wKg / (hMeters * hMeters);
            }
        } else {
            const ft = parseFloat(heightFtInput.value) || 5;
            const inch = parseFloat(heightInInput.value) || 7;
            const wLbs = parseFloat(weightInput.value) || 150;
            const totalInches = (ft * 12) + inch;
            if (totalInches > 0) {
                bmi = (wLbs / (totalInches * totalInches)) * 703;
            }
        }

        bmi = parseFloat(bmi.toFixed(1));
        if (isNaN(bmi) || bmi <= 0) return;

        // Render BMI Results
        if (bmiScoreText) bmiScoreText.textContent = bmi;

        let category = '';
        let badgeClass = '';
        let adviceText = '';
        let circleColor = '';
        let pointerPercent = 0;

        if (bmi < 18.5) {
            category = 'Underweight';
            badgeClass = 'badge badge-warning';
            circleColor = 'var(--accent-teal)';
            adviceText = 'Your BMI indicates underweight. Focus on nutrient-rich meals, healthy fats, protein intake, and strength training to build muscle.';
            pointerPercent = Math.max(5, (bmi / 18.5) * 18.5);
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal Weight';
            badgeClass = 'badge badge-success';
            circleColor = 'var(--secondary-color)';
            adviceText = 'Great job! Your BMI is in the healthy normal range. Maintain a balanced diet, stay physically active, and keep up your regular sleep routines.';
            pointerPercent = 18.5 + ((bmi - 18.5) / (24.9 - 18.5)) * 32;
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            category = 'Overweight';
            badgeClass = 'badge badge-warning';
            circleColor = 'var(--accent-orange)';
            adviceText = 'Your BMI is in the overweight range. Consider incorporating 30 minutes of aerobic cardio exercise daily and managing meal portion sizes.';
            pointerPercent = 50.5 + ((bmi - 25.0) / (29.9 - 25.0)) * 25;
        } else {
            category = 'Obese';
            badgeClass = 'badge badge-danger';
            circleColor = 'var(--accent-red)';
            adviceText = 'Your BMI indicates obesity. Consult a doctor or certified nutritionist for a personalized diet and lifestyle wellness plan.';
            pointerPercent = Math.min(95, 75.5 + ((bmi - 30.0) / 10) * 24.5);
        }

        if (bmiCategoryBadge) {
            bmiCategoryBadge.className = badgeClass;
            bmiCategoryBadge.textContent = category;
        }

        if (bmiCircle) {
            bmiCircle.style.borderColor = circleColor;
        }

        if (bmiPointer) {
            bmiPointer.style.left = `${pointerPercent}%`;
        }

        if (bmiAdviceText) {
            bmiAdviceText.textContent = adviceText;
        }
    }

    if (btnCalcBmi) {
        btnCalcBmi.addEventListener('click', () => {
            calculateBMI();
            showToast('BMI Calculated Successfully', 'fa-solid fa-calculator');
        });
    }

    if (btnResetBmi) {
        btnResetBmi.addEventListener('click', () => {
            if (currentBmiUnit === 'metric') {
                heightCmInput.value = 170;
                heightCmRange.value = 170;
                if (heightCmValText) heightCmValText.textContent = '170 cm';
                weightInput.value = 68;
                weightRange.value = 68;
                if (weightValText) weightValText.textContent = '68 kg';
            } else {
                heightFtInput.value = 5;
                heightInInput.value = 7;
                weightInput.value = 150;
                weightRange.value = 150;
                if (weightValText) weightValText.textContent = '150 lbs';
            }
            calculateBMI();
            showToast('BMI Calculator Reset', 'fa-solid fa-rotate-left');
        });
    }

    // Initial BMI Calculate
    calculateBMI();

    /* ==========================================================================
       5. Health Tips Filter & Modal Popups
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const tipCards = document.querySelectorAll('.tip-card');
    const randomTipBtn = document.getElementById('random-tip-btn');

    // Filter pills event listener
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.getAttribute('data-category');

            tipCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal elements
    const tipModal = document.getElementById('tip-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDoneBtn = document.getElementById('modal-done-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalBodyText = document.getElementById('modal-body-text');
    const modalIcon = document.getElementById('modal-icon');

    const tipDetailsDatabase = {
        '1': {
            title: 'Drink 8 Glasses of Water Daily',
            category: 'Hydration',
            icon: 'fa-solid fa-glass-water',
            content: 'Staying well hydrated is fundamental to every metabolic process in your body. Drinking at least 2 liters (8 glasses) of water daily supports cellular function, keeps skin glowing, aids in nutrient absorption, and prevents mental fatigue. Tip: Carry a reusable water bottle with you and sip throughout the day!'
        },
        '2': {
            title: 'Aim for 30 Mins Daily Walk',
            category: 'Fitness',
            icon: 'fa-solid fa-person-walking',
            content: 'A daily 30-minute brisk walk is one of the most effective non-invasive ways to lower risk of cardiovascular disease, improve glycemic regulation, and enhance mood. Walking outdoors also supplies natural Vitamin D from sunlight exposure.'
        },
        '3': {
            title: 'Prioritize 7–9 Hours of Sleep',
            category: 'Sleep',
            icon: 'fa-solid fa-bed',
            content: 'Quality restorative sleep allows your brain to flush out metabolic toxins and consolidates memories. Establish a consistent sleep schedule by reducing blue screen light 1 hour before bedtime and keeping your bedroom cool and dark.'
        },
        '4': {
            title: 'Practice Mindful Breathing',
            category: 'Mental Health',
            icon: 'fa-solid fa-brain',
            content: 'Deep diaphragm breathing triggers the parasympathetic nervous system, slowing elevated heart rate and reducing cortisol stress hormones. Practice 4-7-8 breathing: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.'
        },
        '5': {
            title: 'Eat Whole Rainbow Foods',
            category: 'Nutrition',
            icon: 'fa-solid fa-carrot',
            content: 'Eating a diverse colorful spectrum of plant foods guarantees a broad intake of essential phytonutrients and dietary fiber. Aim to include green leafy vegetables, orange carrots, berries, and legumes in your weekly diet.'
        },
        '6': {
            title: 'Stretch Every 60 Minutes',
            category: 'Posture',
            icon: 'fa-solid fa-child-reaching',
            content: 'Prolonged sitting compresses your lumbar spine and tightens hip flexors. Set a hourly timer to stand up, roll your shoulders, reach for your toes, and stretch your neck muscles for 60 seconds.'
        }
    };

    // Open Tip Modal
    function openTipModal(tipId) {
        const data = tipDetailsDatabase[tipId];
        if (!data) return;

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalBadge) modalBadge.textContent = data.category;
        if (modalBodyText) modalBodyText.textContent = data.content;
        if (modalIcon) modalIcon.innerHTML = `<i class="${data.icon}"></i>`;

        if (tipModal) tipModal.classList.add('active');
    }

    function closeTipModal() {
        if (tipModal) tipModal.classList.remove('active');
    }

    document.querySelectorAll('.view-tip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tipId = e.currentTarget.getAttribute('data-tip-id');
            openTipModal(tipId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeTipModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeTipModal);
    if (tipModal) {
        tipModal.addEventListener('click', (e) => {
            if (e.target === tipModal) closeTipModal();
        });
    }

    // Random Tip of the Day Generator
    if (randomTipBtn) {
        randomTipBtn.addEventListener('click', () => {
            const keys = Object.keys(tipDetailsDatabase);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            openTipModal(randomKey);
            showToast('Random Wellness Tip Loaded!', 'fa-solid fa-shuffle');
        });
    }

    /* ==========================================================================
       6. Contact Form Validation & Toast System
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            // Validate Name
            const nameVal = contactName ? contactName.value.trim() : '';
            if (nameVal.length < 2) {
                showError(contactName, 'err-name');
                isValid = false;
            } else {
                clearError(contactName, 'err-name');
            }

            // Validate Email
            const emailVal = contactEmail ? contactEmail.value.trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                showError(contactEmail, 'err-email');
                isValid = false;
            } else {
                clearError(contactEmail, 'err-email');
            }

            // Validate Message
            const msgVal = contactMessage ? contactMessage.value.trim() : '';
            if (msgVal.length < 10) {
                showError(contactMessage, 'err-message');
                isValid = false;
            } else {
                clearError(contactMessage, 'err-message');
            }

            if (isValid) {
                showToast('Thank you! Your message has been sent successfully.', 'fa-solid fa-circle-check');
                contactForm.reset();
            }
        });
    }

    function showError(inputEl, errId) {
        if (!inputEl) return;
        const group = inputEl.closest('.form-group');
        if (group) group.classList.add('has-error');
    }

    function clearError(inputEl, errId) {
        if (!inputEl) return;
        const group = inputEl.closest('.form-group');
        if (group) group.classList.remove('has-error');
    }

    // Toast Notification System
    function showToast(message, iconClass = 'fa-solid fa-circle-info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3500);
    }

});
