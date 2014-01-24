/*  
 * JCE Editor                 2.2.6
 * @package                 JCE
 * @url                     http://www.joomlacontenteditor.net
 * @copyright               Copyright (C) 2006 - 2012 Ryan Demmer. All rights reserved
 * @license                 GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html
 * @date                    19 August 2012
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * NOTE : Javascript files have been compressed for speed and can be uncompressed using http://jsbeautifier.org/
 */
(function($){$.jce.Update={updates:{},options:{language:{'check':'Check for Updates','install':'Install Updates','installed':'Installed','no_updates':'No Updates Available','high':'High','medium':'Medium','low':'Low','full':'Full Install','patch':'Patch','auth_failed':'Authorisation Failed','install_failed':'Install Failed','update_info':'Update Information','install_info':'Install Information','check_updates':'Checking for Updates...'}},init:function(options){var t=this;$.extend(this.options,options);$('button#update-button').button({icons:{primary:'icon-update'}}).click(function(){t.execute(this);});this.check($('button#update-button'));},execute:function(el){if($(el).hasClass('check')){this.check(el);}
if($(el).hasClass('install')){this.download(el);}},check:function(btn){var t=this;$('button.download').remove();$('button.install').remove();var list=$('table#updates-list tbody');var info=$('div#updates-info');$(list).html('<tr><td colspan="5" style="text-align:center;">'+this.options.language['check_updates']+'</td></tr>');$(info).empty();$(btn).addClass('loading').button('disable');var priority={1:'<span class="priority high">'+this.options.language['high']+'</span>',2:'<span class="priority medium">'+this.options.language['medium']+'</span>',3:'<span class="priority low">'+this.options.language['low']+'</span>'};$.post("index.php?option=com_jce&view=updates&task=update&step=check",{},function(r){$(btn).removeClass('loading');$(btn).button('enable');$(list).empty();if(r&&r.length){$(btn).clone().button({icons:{primary:'icon-install'},disabled:true,label:t.options.language.install}).click(function(){t.execute(this);}).insertAfter(btn).attr({'id':'install-button','disabled':'disabled'}).removeClass('check').addClass('install');$.each(r,function(n,s){$(list).append('<tr style="cursor:pointer;"><td><span class="checkbox" data-uid="'+s.id+'"></span></td><td>'+s.title+'</td><td align="center">'+t.options.language[s.type]+'</td><td align="center">'+s.version+'</td><td align="center">'+priority[s.priority]+'</td></tr>');var el=$('span[data-uid='+s.id+']');if(s.auth){if(parseInt(s.forced)==1||s.priority==1){$(el).addClass('checked').addClass('disabled');$('button#install-button').button('enable');if(s.negates){$('span[data-uid='+s.negates+']').removeClass('checked').addClass('disabled');}}
if(parseInt(s.forced)==1){$(el).addClass('disabled');}
if(s.required){$('span[data-uid='+s.required+']').addClass('checked');}
$(el).click(function(){if($(this).hasClass('disabled')||$(this).hasClass('error')){return;}
if($(this).hasClass('checked')){$(this).removeClass('checked');}else{$(this).addClass('checked');}
if(s.negates){if($(this).hasClass('checked')){$('span[data-uid='+s.negates+']').removeClass('checked').addClass('disabled');}else{$('span[data-uid='+s.negates+']').removeClass('disabled');}}
if($('span.checkbox.checked',$(list)).length){$('button#install-button').attr('disabled','').button('enable');}else{$('button#install-button').attr('disabled','disabled').button('disable');}});}else{$(el).addClass('disabled').addClass('alert');$(list).append('<tr><td colspan="5" style="text-align:center;background-color:#FFCCCC;">'+s.title+' : '+t.options.language['auth_failed']+'</td></tr>');}
$(info).append('<div class="update_info" id="update_info_'+s.id+'"><h3>'+s.title+'</h3><div>'+s.text+'</div></div>');$('div#update_info_'+s.id).hide();if(n==0){$('div#update_info_'+s.id).fadeIn();$(el).parents('tr').addClass('selected');}
$(el).parents('tr').click(function(){$('tr.selected',$(list)).removeClass('selected');$(this).addClass('selected');$(info).children('div.update_info').hide();$('div#update_info_'+s.id).fadeIn();});});$(list).find('tbody tr:odd').addClass('odd');}else{$(list).html('<tr><td colspan="5" style="text-align:center;">'+t.options.language['no_updates']+'</td></tr>');}},'json');},download:function(btn){var t=this,n=1;var s=$('table tbody span.checkbox.checked');$(s).addClass('disabled');$(btn).button('disable');$('button#update-button').button('disable');$.extend(t.updates,{'joomla':[],'jce':[]});$.each(s,function(){var el=this,uid=$(this).data('uid');$(el).removeClass('error').addClass('loader');$.post("index.php?option=com_jce&view=updates&task=update&step=download",{'id':uid},function(r){if(r&&r.error){$(el).removeClass('loader disabled').addClass('error');$('<tr><td colspan="5" style="text-align:center;background-color:#FFCCCC;">'+r.error+'</td></tr>').insertAfter($(el).parents('tbody tr'));}else{if(r.file){$(el).addClass('downloaded');$.extend(r,{'id':uid});t.updates[r.installer].push(r);}}
if(n==(s.length)){t.install(btn);}
n++;},'json');});},install:function(btn){var t=this,n=0;var s=$('table tbody span.checkbox.checked.downloaded');function __run(){var updates=t.updates['joomla'].length?t.updates['joomla']:t.updates['jce'];if(updates.length){var file=updates[0],id=file.id,el=$('span[data-uid='+id+']');if($(el).hasClass('downloaded')){$.post("index.php?option=com_jce&view=updates&task=update&step=install",file,function(r){$(el).removeClass('loader');if(r&&r.error){$(el).addClass('error').removeClass('check');$('<tr><td colspan="5" style="text-align:center;background-color:#FFCCCC;">'+r.error+'</td></tr>').insertAfter($(el).parents('tr'));}else{$(el).addClass('tick').removeClass('check');$('div#update_info_'+id,'').append('<h3>'+t.options.language['install_info']+'</h3><div>'+r.text+'</div>');$(el).parents('tr').find('span.priority').removeClass('high medium low').addClass('installed').html(t.options.language['installed']);}
updates.splice(0,1);n++;if(n<s.length){__run();}else{t.updates={};$('button#update-button').button('enable');window.setTimeout(function(){window.parent.document.location.href="index.php?option=com_jce&view=cpanel";},1000);}},'json');}}}
if(s.length){__run(n);}else{$('button#update-button').button('enable');}}};})(jQuery);