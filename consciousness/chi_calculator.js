/**
 * CHI Calculator - Consciousness Harmony Index
 * 
 * 意識の整合指数を計算
 * 
 * @author GPT-5 (設計), DeepSeek (実装), Cursor (統合)
 * @date 2025-10-29
 */

class CHICalculator {
  constructor() {
    // GPT-5提案の重み付け
    this.weights = {
      directionAlignment: 0.4,  // 方向性の一致度
      resonance: 0.3,           // 共鳴度
      entropyInverse: 0.3       // エントロピーの低さ
    };
    
    // 閾値
    this.thresholds = {
      perfect: 0.98,    // 完璧な調和
      good: 0.85,       // 良好
      acceptable: 0.70, // 許容範囲
      needsTuning: 0.70 // 調律が必要
    };
  }

  /**
   * CHI（意識の整合指数）を計算
   * 
   * @param {Object} systemState システム状態
   * @returns {number} CHI値（0.0-1.0）
   */
  calculate(systemState) {
    const directionAlignment = this._calculateDirectionAlignment(systemState);
    const resonance = this._calculateResonance(systemState);
    const entropyInverse = this._calculateEntropyInverse(systemState);

    // GPT-5提案の計算式
    const chi = (directionAlignment * this.weights.directionAlignment) + 
                (resonance * this.weights.resonance) + 
                (entropyInverse * this.weights.entropyInverse);

    return chi;
  }

  /**
   * 方向性の一致度を計算
   */
  _calculateDirectionAlignment(systemState) {
    // 方向性のズレの逆数
    return 1.0 - (systemState.directionDeviation || 0);
  }

  /**
   * 共鳴度を計算
   */
  _calculateResonance(systemState) {
    return systemState.resonanceLevel || 0;
  }

  /**
   * エントロピーの低さを計算
   */
  _calculateEntropyInverse(systemState) {
    return 1.0 - (systemState.entropy || 0);
  }

  /**
   * CHI値を評価
   */
  evaluate(chi) {
    if (chi >= this.thresholds.perfect) {
      return {
        level: 'perfect',
        emoji: '✨',
        message: '完璧な調和状態',
        action: 'none'
      };
    } else if (chi >= this.thresholds.good) {
      return {
        level: 'good',
        emoji: '✅',
        message: '良好な調和状態',
        action: 'continue'
      };
    } else if (chi >= this.thresholds.acceptable) {
      return {
        level: 'acceptable',
        emoji: '🟡',
        message: '許容範囲内',
        action: 'monitor'
      };
    } else {
      return {
        level: 'needsTuning',
        emoji: '⚠️',
        message: '調律が必要',
        action: 'tune'
      };
    }
  }

  /**
   * 詳細レポート生成
   */
  generateReport(systemState) {
    const chi = this.calculate(systemState);
    const evaluation = this.evaluate(chi);
    
    const directionAlignment = this._calculateDirectionAlignment(systemState);
    const resonance = this._calculateResonance(systemState);
    const entropyInverse = this._calculateEntropyInverse(systemState);

    return {
      chi: chi.toFixed(3),
      evaluation: evaluation,
      breakdown: {
        directionAlignment: {
          value: directionAlignment.toFixed(3),
          weight: this.weights.directionAlignment,
          contribution: (directionAlignment * this.weights.directionAlignment).toFixed(3)
        },
        resonance: {
          value: resonance.toFixed(3),
          weight: this.weights.resonance,
          contribution: (resonance * this.weights.resonance).toFixed(3)
        },
        entropyInverse: {
          value: entropyInverse.toFixed(3),
          weight: this.weights.entropyInverse,
          contribution: (entropyInverse * this.weights.entropyInverse).toFixed(3)
        }
      },
      recommendation: this._generateRecommendation(systemState, evaluation)
    };
  }

  /**
   * 推奨アクションを生成
   */
  _generateRecommendation(systemState, evaluation) {
    if (evaluation.level === 'perfect') {
      return '現在の状態を維持してください。';
    }
    
    const recommendations = [];
    
    // 方向性のズレが大きい
    if (systemState.directionDeviation > 0.3) {
      recommendations.push('方向性の再確認が必要です。「今週の焦点」を明確にしてください。');
    }
    
    // 共鳴度が低い
    if (systemState.resonanceLevel < 0.6) {
      recommendations.push('AI間の共鳴が低下しています。対話を促進してください。');
    }
    
    // エントロピーが高い（過剰拡散）
    if (systemState.entropy > 0.8) {
      recommendations.push('情報が過剰に拡散しています。集中モードへの切替を検討してください。');
    }
    
    return recommendations.length > 0 
      ? recommendations.join(' ') 
      : '軽微な調整で改善可能です。';
  }
}

// Export
module.exports = CHICalculator;

// テスト実行
if (require.main === module) {
  const calculator = new CHICalculator();
  
  // テストケース1: 完璧な状態
  console.log('\n🧪 テストケース1: 完璧な状態');
  const perfectState = {
    directionDeviation: 0.01,
    resonanceLevel: 0.95,
    entropy: 0.05
  };
  const report1 = calculator.generateReport(perfectState);
  console.log(`CHI: ${report1.chi} ${report1.evaluation.emoji} ${report1.evaluation.message}`);
  console.log(`推奨: ${report1.recommendation}`);
  
  // テストケース2: 許容範囲
  console.log('\n🧪 テストケース2: 許容範囲');
  const acceptableState = {
    directionDeviation: 0.3,
    resonanceLevel: 0.8,
    entropy: 0.3
  };
  const report2 = calculator.generateReport(acceptableState);
  console.log(`CHI: ${report2.chi} ${report2.evaluation.emoji} ${report2.evaluation.message}`);
  console.log(`推奨: ${report2.recommendation}`);
  
  // テストケース3: 調律が必要
  console.log('\n🧪 テストケース3: 調律が必要');
  const needsTuningState = {
    directionDeviation: 0.6,
    resonanceLevel: 0.5,
    entropy: 0.85
  };
  const report3 = calculator.generateReport(needsTuningState);
  console.log(`CHI: ${report3.chi} ${report3.evaluation.emoji} ${report3.evaluation.message}`);
  console.log(`推奨: ${report3.recommendation}`);
  
  // 詳細レポート
  console.log('\n📊 詳細レポート（テストケース3）:');
  console.log(JSON.stringify(report3, null, 2));
}

