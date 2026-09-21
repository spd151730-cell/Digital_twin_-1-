import type { TelemetryData, FaultAlert } from '../data/mockData';

export interface DerivedDemoOutputs {
  engineHealth: number;
  anomalyScore: number;
  twinDeviation: number;
  rulEstimate: string;
  activeFault: FaultAlert | null;
}

export function computeDerivedOutputs(telemetry: TelemetryData): DerivedDemoOutputs {
  let health = 100;
  let anomaly = 0;
  let deviation = 0;
  const evidences: string[] = [];
  let highestSeverity: 'warning' | 'critical' = 'warning';
  let primaryHypothesis = 'Normal Operation';

  // Thermal logic
  if (telemetry.egt > 850) {
    anomaly += 30;
    health -= 15;
    deviation += 8;
    evidences.push(`EGT excessively high (${telemetry.egt.toFixed(0)}°C)`);
    primaryHypothesis = 'Severe thermal overload';
    highestSeverity = telemetry.egt > 900 ? 'critical' : 'warning';
  } else if (telemetry.egt > 780) {
    anomaly += 15;
    health -= 5;
    deviation += 4;
    evidences.push(`EGT slightly elevated (${telemetry.egt.toFixed(0)}°C)`);
    if (primaryHypothesis === 'Normal Operation') primaryHypothesis = 'Possible overheating trend';
  }

  if (telemetry.cht > 200) {
    anomaly += 20;
    health -= 10;
    deviation += 5;
    evidences.push(`CHT over limit (${telemetry.cht.toFixed(0)}°C)`);
    highestSeverity = 'critical';
    primaryHypothesis = 'Cylinder head overheating';
  }

  // Lubrication logic
  if (telemetry.oilPressure < 3.5) {
    anomaly += 40;
    health -= 25;
    deviation += 15;
    evidences.push(`Low oil pressure (${telemetry.oilPressure.toFixed(1)} bar)`);
    highestSeverity = 'critical';
    primaryHypothesis = 'Lubrication failure risk';
  }

  if (telemetry.oilTemp > 120) {
    anomaly += 20;
    health -= 10;
    deviation += 5;
    evidences.push(`High oil temperature (${telemetry.oilTemp.toFixed(0)}°C)`);
    if (primaryHypothesis === 'Normal Operation') primaryHypothesis = 'Oil degradation / overheating';
  }

  // Fuel logic
  if (telemetry.fuelPressure < 2.5) {
    anomaly += 25;
    health -= 15;
    deviation += 8;
    evidences.push(`Low fuel pressure (${telemetry.fuelPressure.toFixed(1)} bar)`);
    highestSeverity = telemetry.fuelPressure < 1.5 ? 'critical' : 'warning';
    primaryHypothesis = 'Fuel starvation / pump issue';
  }

  // Mechanical logic
  if (telemetry.vibration > 5.0) {
    anomaly += 35;
    health -= 20;
    deviation += 12;
    evidences.push(`High vibration (${telemetry.vibration.toFixed(1)} g RMS)`);
    highestSeverity = telemetry.vibration > 8.0 ? 'critical' : 'warning';
    primaryHypothesis = 'Mechanical imbalance / mount failure';
  }

  // Final clamping
  health = Math.max(0, Math.min(100, health));
  anomaly = Math.max(0, Math.min(100, anomaly));
  deviation = Math.max(0, Math.min(100, deviation));

  // Determine RUL based on health
  let rul = '340 hours';
  if (health < 40) rul = '< 10 hours';
  else if (health < 70) rul = 'Approx 50 hours';
  else if (health < 90) rul = 'Approx 200 hours';

  // Construct active fault if anomaly is high enough
  let activeFault: FaultAlert | null = null;
  if (anomaly > 20) {
    // If multiple distinct evidences, confidence drops slightly because it's harder to pinpoint
    const confidence = Math.max(40, 95 - (evidences.length * 5));
    
    let action = 'Monitor closely.';
    if (highestSeverity === 'critical') {
      action = 'Reduce engine load immediately and prepare for emergency recovery.';
    } else if (primaryHypothesis.includes('overheating')) {
      action = 'Reduce load to 72% and inspect cooling airflow.';
    }

    activeFault = {
      id: `AL-SIM-${Math.floor(Math.random() * 1000)}`,
      severity: highestSeverity,
      hypothesis: primaryHypothesis,
      confidence,
      evidence: evidences,
      affectedTelemetry: evidences.map(e => e.split(' ')[0]),
      detectionTime: new Date().toISOString(),
      recommendedAction: action,
      priority: highestSeverity === 'critical' ? 'Immediate' : 'P2',
      timing: highestSeverity === 'critical' ? 'Immediately' : 'within 12 flight hours',
      reason: `Demo model output: ${primaryHypothesis}. Confidence ${confidence}%.`
    };
  }

  return {
    engineHealth: health,
    anomalyScore: anomaly,
    twinDeviation: deviation,
    rulEstimate: rul,
    activeFault
  };
}
