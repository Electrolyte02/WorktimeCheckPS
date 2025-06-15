package com.scaffold.template.reporting;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeyPerformanceIndicators {
    Map<String, Long> indicatorsMap;
}
