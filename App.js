Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		// Radian
		var project_oid = '/project/48118120666';

		this.add({
			xtype: 'rallycombobox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('initiative'),
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity,
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				}
			},
			listeners: {
				// select: this._onSelect,
				select: this._onLoad,
				ready: this._onLoad,
				scope: this
			}
		});
	},
		
	_onLoad: function() {
		var project_oid = '/project/48118120666';
		
		if (this.down('#features')) {
			this.down('#features').destroy();
		}

		var context = this.getContext();
		var modelNames = ['portfolioitem/feature'];
		this.add({
			xtype: 'rallygridboard',
			context: context,
			stateful: false,
			id: 'features',
			modelNames: modelNames,
			toggleState: 'board',
			storeConfig: {
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				},
				filters: [this._getFilter()]
			},
            cardBoardConfig: {
                attribute: 'State',
				fetch: ['Project', 'PercentDoneByStoryCount'],
				cardConfig: {
					xtype: 'rallycard',
					fields: ['c_Groomer'],
					showIconsAndHighlightBorder: false,
					editable: false,
					showAge: true
				},
				columnConfig: {
					plugins: [
						{ptype: 'rallycolumncardcounter'}
					]
				}
            },
			plugins: [
				{
					ptype: 'rallygridboardfieldpicker',
					modelNames: ['PortfolioItem/Feature'],
					headerPosition: 'left'
					//// stateful: true,
					//// stateId: context.getScopedStateId('picker')
				},
				// {
    //                 ptype: 'rallygridboardcustomfiltercontrol',
				// 	headerPosition: 'left',
    //                 filterControlConfig: {
				// 		modelNames: ['PortfolioItem/Feature']
				// 		////stateful: true,
				// 		////stateId: context.getScopedStateId('custom-filter-example')
				// 	}
    //             }
    {
                ptype: 'rallygridboardinlinefiltercontrol',
                    inlineFilterButtonConfig: {
                        stateful: true,
                        stateId: context.getScopedStateId('filters'),
                        modelNames: modelNames,
                        inlineFilterPanelConfig: {
                            quickFilterPanelConfig: {
                                defaultFields: [
                                    'ArtifactSearch',
                                    // 'ModelType'
                                ]
                            }
                        }
                    }
                }
			],
			height: this.getHeight()
		});
	},
		
	_getFilter: function() {
		var combo = this.down('rallycombobox');
		return {
			property: 'Parent.Parent',
			operator: '=',
			value: combo.getValue()
		};
	}

});