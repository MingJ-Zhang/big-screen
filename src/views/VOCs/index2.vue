<template>
    <div class="dashboard-container">
        <!-- 头部 -->
        <header class="header">
            <div class="title">VOCs浓度监测平台</div>
            <div class="time">{{ currentTime }}</div>
        </header>

        <!-- 内容区域 -->
        <div class="content">
            <!-- 左侧面板 -->
            <div class="panel left-panel">
                <div class="panel-item">
                    <div class="panel-header">
                        <span>区域监测点分布</span>
                    </div>
                    <div class="panel-body">
                        <div ref="areaMapChart" class="chart"></div>
                    </div>
                </div>
                <div class="panel-item">
                    <div class="panel-header">
                        <span>监测点状态统计</span>
                    </div>
                    <div class="panel-body">
                        <div ref="monitorStatusChart" class="chart"></div>
                    </div>
                </div>
            </div>

            <!-- 中间面板 -->
            <div class="panel center-panel">
                <div class="center-top">
                    <div class="data-block" v-for="(item, index) in summaryData" :key="index">
                        <div class="data-title">{{ item.title }}</div>
                        <div class="data-value" :class="{ 'warning': item.isWarning }">{{ item.value }}</div>
                        <div class="data-unit">{{ item.unit }}</div>
                    </div>
                </div>
                <div class="panel-item main-chart">
                    <div class="panel-header">
                        <span>实时VOCs浓度趋势</span>
                        <div class="controls">
                            <button class="btn" :class="{ active: timeRange === '24h' }"
                                @click="changeTimeRange('24h')">24小时</button>
                            <button class="btn" :class="{ active: timeRange === '7d' }"
                                @click="changeTimeRange('7d')">7天</button>
                            <button class="btn" :class="{ active: timeRange === '30d' }"
                                @click="changeTimeRange('30d')">30天</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div ref="mainChart" class="chart"></div>
                    </div>
                </div>
                <div class="panel-item alarm-list">
                    <div class="panel-header">
                        <span>告警列表</span>
                        <div class="total-alarm">共{{ alarmList.length }}条告警</div>
                    </div>
                    <div class="panel-body">
                        <div class="alarm-scroll">
                            <div class="alarm-item" v-for="(alarm, index) in alarmList" :key="index">
                                <div class="alarm-level" :class="'level-' + alarm.level">{{ alarm.levelText }}</div>
                                <div class="alarm-info">
                                    <div class="alarm-title">{{ alarm.title }}</div>
                                    <div class="alarm-time">{{ alarm.time }}</div>
                                </div>
                                <div class="alarm-value">{{ alarm.value }} ppb</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧面板 -->
            <div class="panel right-panel">
                <div class="panel-item">
                    <div class="panel-header">
                        <span>监测物质分布</span>
                    </div>
                    <div class="panel-body">
                        <div ref="substanceChart" class="chart"></div>
                    </div>
                </div>
                <div class="panel-item">
                    <div class="panel-header">
                        <span>VOCs来源分析</span>
                    </div>
                    <div class="panel-body">
                        <div ref="sourceChart" class="chart"></div>
                    </div>
                </div>
                <div class="panel-item">
                    <div class="panel-header">
                        <span>设备联网状态</span>
                    </div>
                    <div class="panel-body device-status">
                        <div class="status-item" v-for="(station, index) in stations" :key="index">
                            <div class="status-dot" :class="{ 'online': station.status === 'online' }"></div>
                            <div class="status-name">{{ station.name }}</div>
                            <div class="status-text">{{ station.status === 'online' ? '在线' : '离线' }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'
export default {
    name: 'VocsMonitoringDashboard',
    data() {
        return {
            currentTime: '',
            timeRange: '24h',
            timer: null,
            dataTimer: null,
            animationTimer: null,
            summaryData: [
                { title: '平均浓度', value: '76.5', unit: 'ppb', isWarning: false },
                { title: '最高浓度', value: '142.3', unit: 'ppb', isWarning: true },
                { title: '监测点数', value: '24', unit: '个', isWarning: false },
                { title: '告警数量', value: '3', unit: '个', isWarning: true }
            ],
            alarmList: [
                { level: 3, levelText: '严重', title: '工业园区东A-12监测点VOCs浓度超标', time: '2025-04-25 08:23:15', value: '215.6' },
                { level: 2, levelText: '警告', title: '滨河路B-03监测点苯浓度异常', time: '2025-04-25 06:47:32', value: '142.3' },
                { level: 1, levelText: '注意', title: '科技园C-08监测点数据波动异常', time: '2025-04-24 23:18:45', value: '98.7' },
                { level: 2, levelText: '警告', title: '化工区A-05监测点甲苯浓度上升', time: '2025-04-24 21:06:12', value: '124.5' },
                { level: 1, levelText: '注意', title: '居民区D-02监测点VOCs浓度波动', time: '2025-04-24 18:42:38', value: '87.2' }
            ],
            stations: [
                { name: '工业园A区', status: 'online' },
                { name: '工业园B区', status: 'online' },
                { name: '市政府周边', status: 'offline' },
                { name: '滨河路监测站', status: 'online' },
                { name: '科技园监测站', status: 'online' },
                { name: '居民区站点', status: 'offline' },
                { name: '化工区监测站', status: 'online' },
                { name: '交通枢纽站', status: 'online' }
            ],
            // 图表实例
            charts: {
                mainChart: null,
                areaMapChart: null,
                monitorStatusChart: null,
                substanceChart: null,
                sourceChart: null
            },
            // 模拟实时数据
            realTimeData: {
                times: [],
                values: []
            }
        }
    },
    mounted() {
        this.updateTime();
        this.timer = setInterval(this.updateTime, 1000);

        // 初始化图表
        this.$nextTick(() => {
            this.initCharts();
            this.generateInitialData();
            this.startDataSimulation();
        });
    },
    beforeDestroy() {
        if (this.timer) clearInterval(this.timer);
        if (this.dataTimer) clearInterval(this.dataTimer);
        if (this.animationTimer) clearInterval(this.animationTimer);

        // 销毁图表实例
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.dispose();
        });
    },
    methods: {
        updateTime() {
            this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        },
        initCharts() {
            // 初始化主图表
            this.charts.mainChart = this.initChart(this.$refs.mainChart);
            this.updateMainChart();

            // 初始化区域地图图表
            this.charts.areaMapChart = this.initChart(this.$refs.areaMapChart);
            this.updateAreaMapChart();

            // 初始化监测点状态图表
            this.charts.monitorStatusChart = this.initChart(this.$refs.monitorStatusChart);
            this.updateMonitorStatusChart();

            // 初始化物质分布图表
            this.charts.substanceChart = this.initChart(this.$refs.substanceChart);
            this.updateSubstanceChart();

            // 初始化来源分析图表
            this.charts.sourceChart = this.initChart(this.$refs.sourceChart);
            this.updateSourceChart();
        },
        initChart(dom) {
            return echarts.init(dom);
        },
        changeTimeRange(range) {
            this.timeRange = range;
            this.updateMainChart();
        },
        generateInitialData() {
            // 生成初始的24小时数据
            const now = moment();
            const times = [];
            const values = [];

            for (let i = 23; i >= 0; i--) {
                times.unshift(moment(now).subtract(i, 'hours').format('HH:00'));
                // 生成50-120之间的随机值，模拟VOCs浓度
                values.unshift(Math.floor(Math.random() * 70) + 50);
            }

            this.realTimeData.times = times;
            this.realTimeData.values = values;
        },
        startDataSimulation() {
            // 每30秒更新一次数据
            this.dataTimer = setInterval(() => {
                const times = [...this.realTimeData.times];
                const values = [...this.realTimeData.values];

                // 移除第一个数据点
                times.shift();
                values.shift();

                // 添加新的数据点
                const now = moment();
                times.push(now.format('HH:mm'));

                // 基于前一个值进行波动，模拟连续性
                const lastValue = values[values.length - 1];
                const fluctuation = Math.random() * 20 - 10; // -10到10之间的波动
                let newValue = Math.floor(lastValue + fluctuation);

                // 确保值在合理范围内
                newValue = Math.max(30, Math.min(220, newValue));
                values.push(newValue);

                this.realTimeData.times = times;
                this.realTimeData.values = values;

                // 更新主图表
                this.updateMainChart();

                // 随机更新其他图表
                if (Math.random() > 0.7) {
                    this.updateSubstanceChart();
                    this.updateSourceChart();
                }

                // 随机更新告警
                if (Math.random() > 0.8) {
                    this.updateAlarms();
                }
            }, 30000);

            // 更频繁地更新最新值的动画效果
            this.animationTimer = setInterval(() => {
                if (this.realTimeData.values.length > 0) {
                    const values = [...this.realTimeData.values];
                    const lastValue = values[values.length - 1];
                    const smallFluctuation = (Math.random() * 6) - 3; // 小波动
                    values[values.length - 1] = Math.floor(lastValue + smallFluctuation);
                    this.realTimeData.values = values;
                    this.updateMainChart();

                    // 随机更新摘要数据
                    this.updateSummaryData();
                }
            }, 5000);
        },
        updateMainChart() {
            const timeData = this.timeRange === '24h' ? this.realTimeData.times :
                this.timeRange === '7d' ? Array.from({ length: 7 }, (_, i) => moment().subtract(6 - i, 'days').format('MM-DD')) :
                    Array.from({ length: 30 }, (_, i) => moment().subtract(29 - i, 'days').format('MM-DD'));

            const valueData = this.timeRange === '24h' ? this.realTimeData.values :
                this.timeRange === '7d' ? Array.from({ length: 7 }, () => Math.floor(Math.random() * 70) + 50) :
                    Array.from({ length: 30 }, () => Math.floor(Math.random() * 70) + 50);

            const option = {
                grid: {
                    top: 40,
                    left: 50,
                    right: 50,
                    bottom: 30
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br/>{a}: {c} ppb'
                },
                xAxis: {
                    type: 'category',
                    data: timeData,
                    axisLine: {
                        lineStyle: {
                            color: '#4b5364'
                        }
                    },
                    axisLabel: {
                        color: '#a1a7b3'
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '浓度(ppb)',
                    nameTextStyle: {
                        color: '#a1a7b3'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#1e293b',
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#a1a7b3'
                    }
                },
                series: [{
                    name: 'VOCs浓度',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#3e9aff'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(62, 154, 255, 0.4)' },
                            { offset: 1, color: 'rgba(62, 154, 255, 0.1)' }
                        ])
                    },
                    data: valueData,
                    markLine: {
                        silent: true,
                        lineStyle: {
                            color: '#ff4757'
                        },
                        data: [{
                            yAxis: 150,
                            name: '警戒线'
                        }]
                    }
                }]
            };

            this.charts.mainChart.setOption(option);
        },
        updateAreaMapChart() {
            // 简化的区域地图，使用气泡图表示
            const option = {
                grid: {
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    min: 0,
                    max: 100
                },
                yAxis: {
                    show: false,
                    type: 'value',
                    min: 0,
                    max: 100
                },
                series: [{
                    type: 'scatter',
                    symbolSize: function (val) {
                        return val[2] * 1.5;
                    },
                    itemStyle: {
                        color: function (params) {
                            const value = params.data[3];
                            if (value > 150) return '#ff4757';
                            if (value > 100) return '#ffae2e';
                            return '#3e9aff';
                        }
                    },
                    data: [
                        [20, 70, 10, 76, '工业园A区'],
                        [35, 65, 12, 105, '工业园B区'],
                        [55, 75, 8, 62, '市政府周边'],
                        [75, 65, 11, 89, '滨河路监测站'],
                        [30, 40, 13, 165, '科技园监测站'],
                        [50, 30, 9, 74, '居民区站点'],
                        [70, 35, 14, 142, '化工区监测站'],
                        [85, 20, 10, 88, '交通枢纽站']
                    ],
                    tooltip: {
                        formatter: function (params) {
                            return params.data[4] + '<br/>浓度: ' + params.data[3] + ' ppb';
                        }
                    }
                },
                {
                    type: 'effectScatter',
                    symbolSize: function (val) {
                        return val[2] * 1.5;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        color: function (params) {
                            const value = params.data[3];
                            if (value > 150) return '#ff4757';
                            if (value > 100) return '#ffae2e';
                            return '#3e9aff';
                        }
                    },
                    data: [
                        [30, 40, 13, 165, '科技园监测站'],
                        [70, 35, 14, 142, '化工区监测站']
                    ],
                    tooltip: {
                        formatter: function (params) {
                            return params.data[4] + '<br/>浓度: ' + params.data[3] + ' ppb<br/><span style="color:#ff4757">异常波动</span>';
                        }
                    }
                }]
            };

            this.charts.areaMapChart.setOption(option);
        },
        updateMonitorStatusChart() {
            const option = {
                color: ['#52c41a', '#ff4757', '#ffae2e'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    textStyle: {
                        color: '#a1a7b3'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 16, name: '正常' },
                            { value: 3, name: '异常' },
                            { value: 5, name: '预警' }
                        ]
                    }
                ]
            };

            this.charts.monitorStatusChart.setOption(option);
        },
        updateSubstanceChart() {
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
                },
                radar: {
                    indicator: [
                        { name: '苯', max: 100 },
                        { name: '甲苯', max: 100 },
                        { name: '二甲苯', max: 100 },
                        { name: '乙苯', max: 100 },
                        { name: '苯乙烯', max: 100 },
                        { name: '其他VOCs', max: 100 }
                    ],
                    splitNumber: 4,
                    axisName: {
                        color: '#a1a7b3'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#1e293b'
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#4b5364'
                        }
                    }
                },
                series: [
                    {
                        type: 'radar',
                        data: [
                            {
                                value: [
                                    Math.floor(Math.random() * 40) + 30,
                                    Math.floor(Math.random() * 40) + 40,
                                    Math.floor(Math.random() * 30) + 50,
                                    Math.floor(Math.random() * 20) + 30,
                                    Math.floor(Math.random() * 30) + 20,
                                    Math.floor(Math.random() * 50) + 30
                                ],
                                name: '物质占比',
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(62, 154, 255, 0.6)' },
                                        { offset: 1, color: 'rgba(62, 154, 255, 0.2)' }
                                    ])
                                },
                                lineStyle: {
                                    color: '#3e9aff',
                                    width: 2
                                }
                            }
                        ]
                    }
                ]
            };

            this.charts.substanceChart.setOption(option);
        },
        updateSourceChart() {
            const option = {
                color: ['#3e9aff', '#ffae2e', '#ff4757', '#52c41a', '#9d6eff'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        data: [
                            { value: Math.floor(Math.random() * 10) + 35, name: '工业排放' },
                            { value: Math.floor(Math.random() * 10) + 25, name: '交通排放' },
                            { value: Math.floor(Math.random() * 10) + 15, name: '居民生活' },
                            { value: Math.floor(Math.random() * 5) + 10, name: '建筑装修' },
                            { value: Math.floor(Math.random() * 5) + 5, name: '其他来源' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            color: '#fff'
                        },
                        labelLine: {
                            lineStyle: {
                                color: '#4b5364'
                            }
                        }
                    }
                ]
            };

            this.charts.sourceChart.setOption(option);
        },
        updateAlarms() {
            // 生成新的告警
            const levels = [1, 2, 3];
            const levelTexts = ['注意', '警告', '严重'];
            const titles = [
                '工业园区东A-12监测点VOCs浓度超标',
                '滨河路B-03监测点苯浓度异常',
                '科技园C-08监测点数据波动异常',
                '化工区A-05监测点甲苯浓度上升',
                '居民区D-02监测点VOCs浓度波动',
                '交通枢纽F-06监测点超标',
                '市政府G-01监测点数据异常'
            ];

            const levelIndex = Math.floor(Math.random() * levels.length);
            const level = levels[levelIndex];
            const levelText = levelTexts[levelIndex];
            const title = titles[Math.floor(Math.random() * titles.length)];
            const value = (Math.random() * 150 + 50).toFixed(1);

            // 添加新告警到列表顶部
            this.alarmList.unshift({
                level,
                levelText,
                title,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                value
            });

            // 保持列表不超过10条
            if (this.alarmList.length > 10) {
                this.alarmList.pop();
            }

            // 更新告警数量
            this.summaryData[3].value = this.alarmList.filter(a => a.level > 1).length.toString();
        },
        updateSummaryData() {
            // 更新平均浓度
            const avgConcentration = this.realTimeData.values.reduce((a, b) => a + b, 0) / this.realTimeData.values.length;
            this.summaryData[0].value = avgConcentration.toFixed(1);

            // 更新最高浓度
            const maxConcentration = Math.max(...this.realTimeData.values);
            this.summaryData[1].value = maxConcentration.toFixed(1);
            this.summaryData[1].isWarning = maxConcentration > 120;
        }
    }
}
</script>

<style scoped>
.dashboard-container {
    width: 100%;
    height: 100vh;
    background-color: #0f1624;
    color: #fff;
    padding: 10px;
    overflow: hidden;
}

.header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: linear-gradient(90deg, rgba(24, 40, 72, 0.8) 0%, rgba(38, 57, 89, 0.6) 100%);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #3e9aff;
    text-shadow: 0 0 10px rgba(62, 154, 255, 0.5);
}

.time {
    font-size: 16px;
    color: #a1a7b3;
}

.content {
    display: flex;
    margin-top: 10px;
    height: calc(100vh - 80px);
}

.panel {
    background-color: rgba(16, 26, 44, 0.7);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    margin: 0 5px;
    display: flex;
    flex-direction: column;
}

.left-panel,
.right-panel {
    width: 25%;
}

.center-panel {
    width: 50%;
}

.panel-item {
    margin: 10px;
    background-color: rgba(24, 40, 72, 0.5);
    border-radius: 5px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.panel-header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(90deg, rgba(38, 57, 89, 0.6) 0%, rgba(24, 40, 72, 0.4) 100%);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.panel-body {
    flex-grow: 1;
    padding: 10px;
    position: relative;
}

.chart {
    width: 100%;
    height: 100%;
}

.center-top {
    display: flex;
    height: 100px;
    margin: 10px;
}

.data-block {
    flex: 1;
    margin: 0 5px;
    background-color: rgba(24, 40, 72, 0.5);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.data-block::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3e9aff, #52c41a);
}

.data-title {
    font-size: 14px;
    color: #a1a7b3;
    margin-bottom: 5px;
}

.data-value {
    font-size: 24px;
    font-weight: bold;
    color: #3e9aff;
}

.data-unit {
    font-size: 12px;
    color: #a1a7b3;
    margin-top: 5px;
}

.warning {
    color: #ff4757 !important;
    animation: pulse 2s infinite;
}

.main-chart {
    height: calc(100% - 230px);
}

.alarm-list {
    height: 120px;
}

.controls {
    display: flex;
}

.btn {
    background-color: rgba(24, 40, 72, 0.5);
    border: 1px solid #3e9aff;
    color: #a1a7b3;
    padding: 2px 10px;
    margin-left: 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;
}

.btn:hover,
.btn.active {
    background-color: rgba(62, 154, 255, 0.2);
    color: #fff;
}

.total-alarm {
    font-size: 12px;
    color: #a1a7b3;
}

.alarm-scroll {
    height: 100%;
    overflow-y: auto;
}

.alarm-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(75, 83, 100, 0.3);
}

.alarm-level {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    min-width: 40px;
    text-align: center;
    margin-right: 10px;
}

.level-1 {
    background-color: rgba(255, 174, 46, 0.2);
    color: #ffae2e;
}

.level-2 {
    background-color: rgba(255, 71, 87, 0.2);
    color: #ff4757;
}

.level-3 {
    background-color: rgba(255, 30, 30, 0.3);
    color: #ff1e1e;
    animation: pulse 2s infinite;
}

.alarm-info {
    flex-grow: 1;
}

.alarm-title {
    font-size: 13px;
    margin-bottom: 3px;
}

.alarm-time {
    font-size: 12px;
    color: #a1a7b3;
}

.alarm-value {
    font-size: 14px;
    font-weight: bold;
    color: #ff4757;
}

.device-status {
    overflow-y: auto;
}

.status-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(75, 83, 100, 0.3);
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ff4757;
    margin-right: 10px;
}

.status-dot.online {
    background-color: #52c41a;
    box-shadow: 0 0 5px rgba(82, 196, 26, 0.5);
}

.status-name {
    flex-grow: 1;
    font-size: 14px;
}

.status-text {
    font-size: 12px;
    color: #ff4757;
}

.status-dot.online+.status-name+.status-text {
    color: #52c41a;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(24, 40, 72, 0.5);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: rgba(62, 154, 255, 0.5);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(62, 154, 255, 0.8);
}

/* 动画效果 */
@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

@media screen and (max-width: 1366px) {
    .title {
        font-size: 20px;
    }

    .time {
        font-size: 14px;
    }

    .center-top {
        height: 80px;
    }

    .data-value {
        font-size: 20px;
    }

    .panel-header {
        height: 36px;
        font-size: 14px;
    }

    .alarm-item,
    .status-item {
        padding: 6px 8px;
    }

    .alarm-title {
        font-size: 12px;
    }
}
</style>