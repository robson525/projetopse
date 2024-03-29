<?php

/**
 * @package   	JCE
 * @copyright 	Copyright (c) 2009-2012 Ryan Demmer. All rights reserved.
 * @license   	GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 */
defined('_JEXEC') or die('RESTRICTED');

jimport('joomla.application.component.view');

class WFViewMediabox extends JView {

    function getParams($data) {

        jimport('joomla.form.form');

        if (class_exists('JForm')) {
            //JForm::addFormPath(JPATH_PLUGINS . '/system/jcemediabox');

            $xml = JPATH_PLUGINS . '/system/jcemediabox/jcemediabox.xml';

            $params = new WFParameter($data, $xml, '', array('control' => 'config:fields:fieldset'));

            $groups = array();
            $array  = array();

            foreach ($params->getGroups() as $group => $num) {
                $groups[] = $params->getParams('fields', $group);
            }

            foreach ($groups as $group) {
                $array = array_merge($array, $group);
            }

            return $array;
            
        } else {
            // get params definitions
            $params = new JParameter($data, JPATH_PLUGINS . '/system/jcemediabox.xml');

            $xml = JPATH_PLUGINS . '/system/jcemediabox.xml';
            $params->loadSetupFile($xml);

            return $params->getParams();
        }

        /* if (WF_JOOMLA15) {


          // Use JForm
          } else {
          $xml = JPATH_PLUGINS . '/system/jcemediabox/jcemediabox.xml';

          $form = JForm::getInstance('plg_jcemediabox.plugins', 'jcemediabox', array('control' => 'params'), false);
          return $form->getFieldset('params');

          /* $parser = JFactory::getXMLParser('Simple');

          if ($parser->loadFile($xml)) {
          if ($fieldsets = $parser->document->getElementByPath('config')->getElementByPath('fields')->children()) {
          foreach ($fieldsets as $fieldset) {
          $params->setXML($fieldset);
          }
          }
          }

          $params = new WFParameter($data, $xml);

          $groups = array();
          $array  = array();

          foreach ($params->getGroups() as $group => $num) {
          $groups[] = $params->getParams('params', $group);
          }

          foreach ($groups as $group) {
          $array = array_merge($array, $group);
          }

          return $array;
          } */
    }

    function display($tpl = null) {
        $db = JFactory::getDBO();

        $lang = JFactory::getLanguage();
        $lang->load('plg_system_jcemediabox');

        $client = JRequest::getWord('client', 'site');
        $model = $this->getModel();

        $plugin = JPluginHelper::getPlugin('system', 'jcemediabox');

        $params = $this->getParams($plugin->params);

        $this->assignRef('params', $params);
        $this->assignRef('client', $client);

        $this->document->addScript(JURI::root(true) . '/components/com_jce/editor/libraries/js/colorpicker.js?version=' . $model->getVersion());
        $this->document->addStyleSheet('components/com_jce/media/css/colorpicker.css?version=' . $model->getVersion());

        $options = array(
            'template_colors' => WFToolsHelper::getTemplateColors(),
            'custom_colors' => '',
            'labels' => array(
                'picker' => WFText::_('WF_COLORPICKER_PICKER'),
                'palette' => WFText::_('WF_COLORPICKER_PALETTE'),
                'named' => WFText::_('WF_COLORPICKER_NAMED'),
                'template' => WFText::_('WF_COLORPICKER_TEMPLATE'),
                'custom' => WFText::_('WF_COLORPICKER_CUSTOM'),
                'color' => WFText::_('WF_COLORPICKER_COLOR'),
                'apply' => WFText::_('WF_COLORPICKER_APPLY'),
                'name' => WFText::_('WF_COLORPICKER_NAME')
            )
        );

        $this->document->addScriptDeclaration('jQuery(document).ready(function($){$("input.color").colorpicker(' . json_encode($options) . ');});');

        WFToolbarHelper::save();
        WFToolbarHelper::apply();
        WFToolbarHelper::help('mediabox.config');

        parent::display($tpl);
    }

}
