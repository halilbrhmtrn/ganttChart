/*  eslint no-unused-expressions:off*/
export class timelineController {
	constructor (commonsService) {
		'ngInject';
		this.CommonsService = commonsService;
		this.AuthTokenRaw = JSON.parse(localStorage.getItem()).raw;
		this.ExecutionPlans = [];
		this.Config = {};
		this.MockData = [
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9627,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9627,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9627,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:9627,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9658,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9658,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9658,ExecutionOwner:"ASD_DFG",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9630,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9630,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9630,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:9630,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T18:33:04+03:00",ExecutionPlanId:9630,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T18:17:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9617,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9617,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9617,ExecutionOwner:"EFK_GGG",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9685,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9685,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9685,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:9685,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9690,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9690,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:9690,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9690,ExecutionOwner:"KDR_BOI",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9611,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:9611,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:9611,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:9611,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T18:53:04+03:00",ExecutionPlanId:9611,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T18:27:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:9541,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T18:13:27+03:00",ExecutionPlanId:9541,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T17:50:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T19:13:34+03:00",ExecutionPlanId:9541,ExecutionOwner:"LDH_PNGR",StartDate:"2018-07-26T18:27:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:8189,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:32:35+03:00",ExecutionPlanId:8189,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T17:18:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T17:53:19+03:00",ExecutionPlanId:8189,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T17:42:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T18:13:14+03:00",ExecutionPlanId:8189,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T17:57:00+03:00",StatusStrValue:"Completed",StatusValue:3},
			{CompleteDate:"2018-07-26T18:53:04+03:00",ExecutionPlanId:8189,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T18:27:00+03:00",StatusStrValue:"Completed",StatusValue:4},
			{CompleteDate:"2018-07-26T17:13:24+03:00",ExecutionPlanId:8187,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T16:47:00+03:00",StatusStrValue:"Completed",StatusValue:1},
			{CompleteDate:"2018-07-26T18:13:27+03:00",ExecutionPlanId:8187,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T17:50:00+03:00",StatusStrValue:"Completed",StatusValue:2},
			{CompleteDate:"2018-07-26T19:13:34+03:00",ExecutionPlanId:8187,ExecutionOwner:"7V LOTR",StartDate:"2018-07-26T18:27:00+03:00",StatusStrValue:"Completed",StatusValue:3}
		];
	}
	$onInit () {
		//this.PrepareChart();
		this.PrepareChartWithMockData();
		this.DrawChart();
	}
	PrepareChartWithMockData () {
		let self = this;
		self.ExecutionPlans = self.MockData;
		let Today = new Date(2018,6,26,20);
		self.Config = {
			title: 'YOUR CHART TITLE',
			currentTimeLine: {
				value: Today,
				color: 'orange',
				dashStyle: 'Dash'
			},
			yAxis: {
				categories: self.CommonsService.getCategories(self.ExecutionPlans),
				plotBands: self.CommonsService.getPlotBands(self.ExecutionPlans)
			},
			series: self.CommonsService.getSeries(self.ExecutionPlans)
		}
	}
	PrepareChart () {
		let self = this;
		this.CommonsService.fetchData(this.AuthTokenRaw)
			.then(function (response) {
				self.ExecutionPlans = response.data.value;
				let Today = new Date();
				self.Config = {
					title: '',
					currentTimeLine: {
						value: Today,
						color: 'grey',
						dashStyle: 'Dash'
					},
					yAxis: {
						categories: self.CommonsService.getCategories(self.ExecutionPlans),
						plotBands: self.CommonsService.getplotBands(self.ExecutionPlans)
					},
					series: self.CommonsService.getSeries(self.ExecutionPlans)
				}
			});
	}
	DrawChart () {
		this.CommonsService.invokeChart(this.Config);
	}
}