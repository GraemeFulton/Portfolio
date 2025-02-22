var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Page.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'Users', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: {type: Types.LocalFile,
        dest: './uploads/page/single',
        prefix: '/page/single',
        format: function(item, file){
            return '<img src="' + file.href + '" style="max-width: 300px">'
        }
    },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PageCategory', many: true },
	images: {
        type: Types.LocalFiles,
        dest: './uploads/page/multiple',
        prefix: '/page/multiple',
        format: function(item, file){
            return '<img src="' + file.href + '" style="max-width: 300px">'
        }
    }
});

Page.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Page.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Page.register();
