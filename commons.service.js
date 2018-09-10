/*  eslint max-lines:off*/
export class commonsService {
	constructor ($http) {
		'ngInject';
		this.http = $http;
		this.baseUrl = '';
		this.StatusColors = [
			'#9d9ea0',
			'#5c90f9',
			'#d8210d',
			'#0a0a0a',
			'#7ff98f',
			'#5c90f9',
			'#5c90f9',
			'#5c90f9',
			'#5c90f9'
		];
		this.PlotBandsColors = [
			'#d0fffe',
			'#fffddb',
			'#e4ffde',
			'#ffd3fd',
			'#ffe7d3',
			'#CED8F6',
			'#7161EF',
			'#F9F3FC',
			'#F0DCD2',
			'#E5E6E4'
		];
		this.ExecutionOwnerColor = {};
	}

	fetchData (AuthTokenRaw) {
		return this.http({
			method: 'GET',
			url: this.baseUrl,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${AuthTokenRaw}`
			}
		});
	}
	
	/* eslint max-lines-per-function:off*/
	/* eslint no-param-reassign:off*/
	/* eslint id-length:off*/
	getSeries (Executions) {
		const series = [];
		let i = 0;
		// Replace null value of CompleteData with Today's string
		Executions = this.fillNull(Executions);
		const Legends = this.getCategories(Executions);
		for (let j = 0; j < Legends.length; j++) {
			const item = {
				name: Legends[j],
				data: [],
				id: Legends[j]
			};
			series.push(item);
		}
		for (i; i < Executions.length; i++) {
			const item = {
				status: Executions[i].StatusValue,
				color: this.getColor(Executions[i].StatusValue, this.StatusColors),
				name: Executions[i].ExecutionOwner,
				id: Executions[i].ExecutionPlanId,
				data: [],
				linkedTo: `${Executions[i].ExecutionOwner} > ${Executions[i].ExecutionPlanId}`,
				showInLegend: false
			};
			if (Executions[i + 1]) {
				const itemProperties = this.getItemProps(Executions, i);
				const nextItemProps = this.getItemProps(Executions, i + 1);
				item.data.push({
					x: itemProperties.from,
					y: itemProperties.yIndex,
					// Label: itemProperties.label,
					from: itemProperties.from,
					to: itemProperties.to
				}, {
					x: itemProperties.to,
					y: itemProperties.yIndex,
					from: itemProperties.from,
					to: itemProperties.to
				});
				item.data.push([
					(itemProperties.to + nextItemProps.from) / 2,
					null
				]);
			} else {
				const itemProperties = this.getItemProps(Executions, i);
				item.data.push({
					x: itemProperties.from,
					y: itemProperties.yIndex,
					from: itemProperties.from,
					to: itemProperties.to
				}, {
					x: itemProperties.to,
					y: itemProperties.yIndex,
					from: itemProperties.from,
					to: itemProperties.to
				});
			}
			series.push(item);
		}
		return series;
	}

	// Modify timestamps and getting yIndex value
	getItemProps (Executions, index) {
		const item = {};
		const ExecutionStarts = Executions[index].StartDate.match(/\d+/g).map(Number);
		const ExecutionComplete = Executions[index].CompleteDate.match(/\d+/g).map(Number);
		item.from = Date.UTC(
			ExecutionStarts[0], ExecutionStarts[1] - 1, ExecutionStarts[2],
			ExecutionStarts[3], ExecutionStarts[4], ExecutionStarts[5]
		);
		item.to = Date.UTC(
			ExecutionComplete[0], ExecutionComplete[1] - 1, ExecutionComplete[2],
			ExecutionComplete[3], ExecutionComplete[4], ExecutionComplete[5]
		);
		item.yIndex = this.getYIndexValue(Executions, index);
		return item;
	}

	// Add Today's date as CompleteDate to Executions those have null value as CompleteDate
	/* eslint class-methods-use-this:off*/
	fillNull (Executions) {
		const today = new Date();
		const TodayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}T${
			today.getHours()}:${today.getMinutes()}:${today.getSeconds()}+03:00`;
		for (let i = 0; i < Executions.length; i++) {
			if (Executions[i].CompleteDate === null && typeof Executions[i].CompleteDate === 'object') {
				Executions[i].CompleteDate = TodayStr;
			}
		}
		return Executions;
	}

	getCategories (Executions) {
		const CategoriesAndJobIds = [];

		for (let i = 0; i < Executions.length; i++) {
			const str = `${Executions[i].ExecutionOwner} > ${Executions[i].ExecutionPlanId.toString()}`;
			CategoriesAndJobIds.push(str);

			while (Executions[i + 1] && Executions[i].ExecutionPlanId === Executions[i + 1].ExecutionPlanId) {
				if (Executions[i].ExecutionOwner === Executions[i + 1].ExecutionOwner) {
					i++;
				} else {
					break;
				}
			}
		}
		return CategoriesAndJobIds;
	}

	getPlotBands (Executions) {
		const Categories = [];
		let temp = [];
		const arr = this.getCategories(Executions);

		for (let i = 0; i < arr.length; i++) {
			temp = arr[i].split('>');
			Categories.push(temp[0].trim());
		}
		const UniqueExecutionOwners = this.uniq(Categories);

		for (let i = 0; i < UniqueExecutionOwners.length; i++) {
			this.ExecutionOwnerColor[UniqueExecutionOwners[i]] = this.PlotBandsColors[i];
		}

		return this.plotBands(
			this.getAllIndexses(Categories, UniqueExecutionOwners),
			UniqueExecutionOwners,
			this.ExecutionOwnerColor
		);
	}

	// Get Y index for a particular Execution getting from Categories Array
	getYIndexValue (Executions, index) {
		let value;
		const FindIndexStr = `${Executions[index].ExecutionOwner} > ${Executions[index].ExecutionPlanId}`;
		const CategoriesAndJobIds = this.getCategories(Executions);

		for (let i = 0; i < CategoriesAndJobIds.length; i++) {
			if (CategoriesAndJobIds[i] === FindIndexStr) {
				value = i;
			}
		}
		return value;
	}

	uniq (arr) {
		const seen = {};
		const out = [];
		const len = arr.length;
		let j = 0;
		for (let i = 0; i < len; i++) {
			const item = arr[i];
			if (seen[item] !== 1) {
				seen[item] = 1;
				out[j++] = item;
			}
		}
		return out;
	}

	getColor (sw, colors) {
		sw = parseInt(sw, 10);
		return colors[sw];
	}

	pluck (arrOfObjects, getProperty) {
		return arrOfObjects.map(item => item[getProperty]);
	}

	// Getting indexes of the array reside in y axis for plotBands
	getAllIndexses (arr, optName) {
		let indexes = [];
		const indexesAll = [];
		let i;
		let j;
		for (j = 0; j < optName.length; j++) {
			for (i = 0; i < arr.length; i++) {
				if (arr[i] === optName[j]) {
					indexes.push(i);
				}
			}
			indexesAll.push(indexes);
			indexes = [];
		}
		return indexesAll;
	}

	getColorWithExecutionOwnerName (optimName, optimColors) {
		if (optimColors.hasOwnProperty(optimName)) {
			return optimColors[optimName];
		}
	}

	plotBands (indexes, optimNames, optimColors) {
		const arr = [];
		for (let j = 0; j < optimNames.length; j++) {
			for (let i = 0; i < indexes[j].length; i++) {
				const tempObj = {
					color: this.getColorWithExecutionOwnerName(optimNames[j], optimColors),
					from: indexes[j][i] - 0.5,
					to: indexes[j][i] + 0.5
				};
				arr.push(tempObj);
			}
		}
		return arr;
	}

	/* eslint no-new: off*/
	/* eslint no-undef: off*/
	invokeChart (config) {
		new Highcharts.Chart(
			{
				chart: {
					renderTo: 'container',
					zoomType: 'xy',
					panning: true
				},
				navigator: {
					enabled: true
				},
				rangeSelector: {
					enabled: true,
					buttons: [
						{
							type: 'minute',
							count: 15,
							text: 'Raw',
							events: {
								click () {
									alert('YOU CAN HANDLE EVENTS');
								}
							}
						},
						{
							type: 'hour',
							count: 1,
							text: 'Hourly'
						},
						{
							type: 'day',
							count: 1,
							text: 'Daily'
						},
						{
							type: 'week',
							count: 1,
							text: 'Weekly'
						},
						{
							type: 'all',
							text: 'All'
						}
					],
					buttonTheme: {
						width: 60
					},
					selected: 2
				},
				title: {
					text: config.title
				},
				xAxis: {
					type: 'datetime',
					scrollbar: {
						enabled: true,
						barBorderRadius: 7,
						margin: 20
					},
					plotLines: [
						// A line indicates Current Time
						{
							value: config.currentTimeLine.value,
							color: config.currentTimeLine.color,
							width: 2.8,
							dashStyle: config.currentTimeLine.dashStyle,
							zIndex: 99
						}
					]
				},
				yAxis: {
					categories: config.yAxis.categories,
					plotBands: config.yAxis.plotBands,
					min: 0,
					max: 9,
					scrollbar: {
						enabled: true,
						barBorderRadius: 7,
						margin: 20
					},
					tickinterval: 1,
					tickPixelinterval: 200,
					labels: {
						style: {
							color: '#525151',
							font: '12px Helvetica',
							fontWeight: 'bold'
						}
					},
					startOnTick: false,
					endOnTick: false,
					title: {
						text: 'YOUR TEXT'
					},
					minPadding: 0.2,
					maxPadding: 0.2,
					fontSize: '15px'
				},
				legend: {
					enabled: true,
					itemHiddenStyle: {
						color: '#444444'
					},
					itemHoverStyle: {
						color: 'white'
					},
					title: {
						text: 'YOUR TITLE',
						style: {
							fontStyle: 'italic'
						}
					},
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: 20,
					y: 70,
				},
				tooltip: {
					formatter () {
						return `<b>${config.yAxis.categories[this.y]}</b><br/>${
							Highcharts.dateFormat('%m-%d-%Y * %A, %b %e, %H:%M', this.point.options.from)
						} - ${Highcharts.dateFormat('%m-%d-%Y * %A, %b %e, %H:%M', this.point.options.to)}`;
					}
				},
				plotOptions: {
					line: {
						lineWidth: 10,
						marker: {
							enabled: false
						},
						dataLabels: {
							enabled: true,
							align: 'left',
							formatter () {
								return this.point.options && this.point.options.label;
							}
						}
					},
					series: {
						dataLabels: {
							style: {
								textOutline: false
							}
						},
						cursor: 'pointer',
						events: {
							click () {
								alert(`${this.name} clicked\n AGAIN YOU CAN HANDLE EVENTS\n`);
							}
						}
					}
				},
				series: config.series
			},
			chart => {
				chart.renderer.text('<span style="color: #9d9ea0;font-weight: bold">Not Started</span> |' +
				'<span style="color: #5c90f9;font-weight: bold">YOUR EXECUTION STAT</span> | ' +
				'<span style="color: #d8210d;font-weight: bold">YOUR EXECUTION STAT</span> | ' +
				' <span style="color: #0a0a0a;font-weight: bold">Cancelled</span> | ' +
				'<span style="color: #7ff98f;font-weight: bold">Completed Succesfully</span>', 650, 70)
					.css({
						fontSize: '15px'
					})
					.add();
			}
		);
	}
}
