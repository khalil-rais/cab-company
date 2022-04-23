<?php
/**
 * @file
 * Contains \Drupal\hello_world\HelloWorldController.
 */
 
namespace Drupal\vtc\Controller;
 

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\AlertCommand;
use Drupal\Core\Datetime\DrupalDateTime;
use Symfony\Component\HttpFoundation\RedirectResponse;

/*use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\commerce_product\Entity\ProductVariationType;*/

require(drupal_get_path('module', 'vtc') . '/fpdf17/pdf.php');

class VtcController extends ContainerBuilder {

	private $user = "";
	private $password = "";

	private function _get_price ($collected_data , $latitude){
		$tariff = 0;
		//Ainsi que si possible procédé au changement des tarifs forfaitaire des aéroports qui passerais de 65 € au lieu de 55 € anciennement et de 55€ au lieux de 45 € précédemment ainsi que les Trajets Paris intra-muros à 40€ au lieux de 35€ précédemment. 
		$tariff_grid = array (
			1 => array (1 => 40, 2=> 65, 3=> 65),//Cas1: Paris-Paris
			2 => array (1 => 65, 2=> 90, 3=> 120),//Cas2: Paris-Orly
			20 => array (//Cas2bis: Paris-Orly	
				1 => array (1 => 50,  2=> 65, 3=> 2), 
				2 => array (1 => 55,  2=> 90, 3=> 2.5), 
				3 => array (1 => 65,  2=> 120, 3=> 3)
			),
			3 => array (1 => 65, 2=> 90, 3=>  120),//Cas3: Paris-CDG
			30 => array (//Cas3bis: Paris-CDG
				1 => array (1 => 40,  2=> 65, 3=> 2), 
				2 => array (1 => 55,  2=> 90, 3=> 2.5), 
				3 => array (1 => 65,  2=> 120, 3=> 3)
			),
			4 => array (1 => 90, 2=> 130, 3=> 149),//Cas4: Roissy-Orly
			5 => array (1 => 150, 2=> 200, 3=> 230),
			6 => array (1 => 80, 2=> 100, 3=> 120),
			7 => array (1 => 50, 2=> 65 , 3=> 80),//Cas7: Mise à Disposition
			8 => array (1 => 2, 2=> 2.50, 3=> 3),//Cas8: KM
			88 => array (1 => 40, 2=> 55, 3=> 65),//Cas8: KM
		);
		
		$gamme_auto = array (
			1 => "Eco: 4 passagers - 3 bagages.",
			2 => "Berline: 4 passagers - 3 bagages.",
			3 => "Van: 6 à 8 passagers - 7 bagages.",
		);

		
		if ($collected_data["returnjurney"] ==1){//Cas7: Mise à Disposition
			if (
				isset ($collected_data["orderdatereturn"]) && 
				isset ($collected_data["selPtHr2"]) && 
				isset ($collected_data["selPtMn2"])
			){
				
				
				$return_date = strtotime($collected_data["orderdatereturn"]." ".$collected_data["selPtHr2"] .":". $collected_data["selPtMn2"].":00");
				
				$departure_date = strtotime($collected_data["orderdate"]." ".$collected_data["selPtHr1"] .":". $collected_data["selPtMn1"].":00");
				
				$trip_duration = $return_date - $departure_date;
				$trip_duration_hour = intdiv($trip_duration, 60*60);
				
				if ($trip_duration > $trip_duration_hour*60*60){
					$trip_duration_hour++;
										
				}
				$tariff = sprintf("€%01.2f", ceil($tariff_grid[7][$collected_data["passengers"]]*$trip_duration_hour));
				\Drupal::logger('vtc')->notice('Here I am '.
				$tariff_grid[7][$collected_data["passengers"]].'|'.				
				$departure_date.'|'.
				$return_date.'|'.
				$trip_duration_hour.'|'.
				$trip_duration.'|'
				.': returnjurney');

			}
			else{
				$tariff = sprintf("€%01.2f",0);
			}
		}
		elseif (//Cas1: Paris-Paris
			(	$collected_data["address_from_locality"] =="Paris" 
				or 
				(
					$collected_data["address_from_postal_code"]>=75000 
					and 
					$collected_data["address_from_postal_code"]<=75999
				)
			)
			and 
			(	$collected_data["address_to_locality"] =="Paris" 
				or 
				(
					$collected_data["address_to_postal_code"]>=75000 
					and 
					$collected_data["address_to_postal_code"]<=75999
				)
			)
		){
			$tariff = sprintf("€%01.2f", ceil($tariff_grid[1][$collected_data["passengers"]]));
			
		}
		elseif (//Cas2: Paris-Orly
			(
				(
					$collected_data["address_from_locality"] == "Paris" 
					or
					(
						$collected_data["address_from_postal_code"]>=75000 
						and 
						$collected_data["address_from_postal_code"]<=75999
					)				
				)
				and
				(
					$collected_data["address_to_locality"] == "Orly" 
					or
					$collected_data["address_to_postal_code"]==94390
					or
					preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_to"])		
				)
			)
			or
			(
				(
					$collected_data["address_from_locality"] == "Orly" 
					or
					$collected_data["address_from_postal_code"]==94390
					or
					preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_from"])				
				)
				and
				(
					$collected_data["address_to_locality"] == "Paris" 
					or
					(
						$collected_data["address_to_postal_code"]>=75000 
						and 
						$collected_data["address_to_postal_code"]<=75999
					)
				)			
			)
		){
			$tariff = sprintf("€%01.2f", ceil($tariff_grid[2][$collected_data["passengers"]]));
		}
		elseif (//Cas3: Paris-CDG
			(
				(
					$collected_data["address_from_locality"] == "Paris" 
					or
					(
						$collected_data["address_from_postal_code"]>=75000 
						and 
						$collected_data["address_from_postal_code"]<=75999
					)				
				)
				and
				(
					$collected_data["address_to_locality"] == "Roissy-en-France" 
					or
					$collected_data["address_to_locality"] == "Le Mesnil-Amelot" 
					or
					$collected_data["address_to_locality"] == "Tremblay-en-France" 
					or
					$collected_data["address_to_postal_code"]==95700
					or
					preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_to"])
				)
			)
			or
			(
				(
					$collected_data["address_from_locality"] == "Roissy-en-France" 
					or
					$collected_data["address_from_locality"] == "Le Mesnil-Amelot" 
					or
					$collected_data["address_from_locality"] == "Tremblay-en-France" 
					or
					$collected_data["address_from_postal_code"]==95700
					or
					preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_from"])
				)
				and
				(
					$collected_data["address_to_locality"] == "Paris" 
					or
					(
						$collected_data["address_to_postal_code"]>=75000 
						and 
						$collected_data["address_to_postal_code"]<=75999
					)
				)			
			)		
		
		){
			$tariff = sprintf("€%01.2f", ceil($tariff_grid[3][$collected_data["passengers"]]));
		}
		elseif (//Cas4: Roissy-Orly
			(
				(
					$collected_data["address_from_locality"] == "Orly" 
					or
					$collected_data["address_from_postal_code"]==94390
					or
					preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_from"])		
				)
				and
				(
					$collected_data["address_to_locality"] == "Roissy-en-France" 
					or
					$collected_data["address_to_locality"] == "Le Mesnil-Amelot" 
					or
					$collected_data["address_to_locality"] == "Tremblay-en-France" 
					or
					$collected_data["address_to_postal_code"]==95700
					or
					preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_to"])
				)
			)
			or
			(
				(
					$collected_data["address_from_locality"] == "Roissy-en-France" 
					or
					$collected_data["address_from_locality"] == "Le Mesnil-Amelot" 
					or
					$collected_data["address_from_locality"] == "Tremblay-en-France" 
					or
					$collected_data["address_from_postal_code"]==95700
					or
					preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_from"])			
				)
				and
				(
					$collected_data["address_to_locality"] == "Orly"
					or
					$collected_data["address_to_postal_code"]==94390
					or
					preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_to"])
				)			
			)	
		
		){
			$tariff = sprintf("€%01.2f", ceil($tariff_grid[4][$collected_data["passengers"]]));
		}
		elseif (//Cas2bis: Paris-Orly				
			$collected_data["address_to_locality"] == "Orly" 
			or
			$collected_data["address_to_postal_code"]==94390
			or
			$collected_data["address_from_locality"] == "Orly" 
			or
			$collected_data["address_from_postal_code"]==94390
			or
			preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_to"])
			or
			preg_match ('/\(ORY\)|Orly [1-9]|Aéroport de Paris-Orly|Aéroport d\'Orly/' , $collected_data["address_from"])			
		){		
			$distance_class =array(
				1 => array (1 => 10,2 => 22.5),
				2 => array (1 => 10,2 => 28),
				3 => array (1 => 10,2 => 26.6)
			);
			$distance = str_replace(" Kilomètres", "", $collected_data["ride_distance"]);
			if ($distance < $distance_class[$collected_data["passengers"]][1]) {
				$tariff = sprintf("€%01.2f", ceil($tariff_grid[20][$collected_data["passengers"]][1]));
			}
			elseif ($distance < $distance_class[$collected_data["passengers"]][2]) {
				$tariff = sprintf("€%01.2f", ceil($tariff_grid[20][$collected_data["passengers"]][2]));
			}
			else{
				$tariff = sprintf(
					"€%01.2f", 
					ceil(
						$tariff_grid[20][$collected_data["passengers"]][3] * $distance
					)
				);
			}
			
			
		}
		elseif (//Cas3bis: Paris-CDG
			$collected_data["address_to_locality"] == "Roissy-en-France" 
			or
			$collected_data["address_to_locality"] == "Le Mesnil-Amelot" 
			or
			$collected_data["address_to_locality"] == "Tremblay-en-France" 
			or
			$collected_data["address_to_postal_code"]==95700
			or
			preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_to"])
			or
			$collected_data["address_from_locality"] == "Roissy-en-France" 
			or
			$collected_data["address_from_locality"] == "Le Mesnil-Amelot" 
			or
			$collected_data["address_from_locality"] == "Tremblay-en-France" 
			or
			$collected_data["address_from_postal_code"]==95700
			or
			preg_match ('/CDG|Aéroport Paris-Charles-de-Gaulle|Aéroport Charles-de-Gaulle/' , $collected_data["address_from"])
		){			
			$distance_class =array(
				1 => array (1 => 17.5,2 => 27.5),
				2 => array (1 => 17.5,2 => 36),
				3 => array (1 => 17.5,2 => 33.3)
			);
			$distance = str_replace(" Kilomètres", "", $collected_data["ride_distance"]);
			if ($distance < $distance_class[$collected_data["passengers"]][1]) {
				$tariff = sprintf("€%01.2f", ceil($tariff_grid[30][$collected_data["passengers"]][1]));
			}
			elseif ($distance < $distance_class[$collected_data["passengers"]][2]) {
				$tariff = sprintf("€%01.2f", ceil($tariff_grid[30][$collected_data["passengers"]][2]));
			}
			else{
				$tariff = sprintf(
					"€%01.2f", 
					ceil(
						$tariff_grid[30][$collected_data["passengers"]][3] * $distance
					)
				);
			}
		}
		elseif ($collected_data["ride_distance"] != "0"){//Cas8: KM
			//60.84
			//" =>
			\Drupal::logger('vtc')->notice('Booking Checking 1:Cas 8');
			$distance = str_replace(" Kilomètres", "", $collected_data["ride_distance"]);
			if ($distance<=17.5){
				$tariff = sprintf("€%01.2f", $tariff_grid[88][$collected_data["passengers"]]);
			}
			else{
				$tariff = sprintf(
					"€%01.2f", 
					ceil(
						$tariff_grid[88][$collected_data["passengers"]] + 
						$tariff_grid[8][$collected_data["passengers"]]*($distance-17.5)
					)
				);
			}
			
			
			//ob_start();
			//var_dump("Computation logic");
			//var_dump(
			//	array (
			//		$distance,
			//		
			//	)
			//);
			//$dumpy = ob_get_clean();
			//\Drupal::logger('vtc')->notice('post info: '.$dumpy);			
		}
		else{
			$tariff= "Aucun tariff n'est trouvé";
		}
		
		if ($latitude == 1){
			//Change Request pour notifier JeffVTC suite à une recherche de prix
			$source = '';
			$destination = '';
			$cc = '';
			$sujet = 'Demande de Prix Reçue';
			$message_html = '<p>Bonjour,</p>
<p>Un Client vient de v&eacute;rifier le prix d\'une course suivant les donn&eacute;es suivantes:</p>';
			$field_service_description = "";
			
			$message_html .= '
<p><strong>Date et heure de dp&eacute;art:</strong> '.$collected_data["orderdate"].' '.$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].'</p>';
			$field_service_description .= '
<p><strong>'.t('Departure').':</strong> '.$collected_data["orderdate"].' '.$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].'</p>';
			

			
			if ($collected_data["returnjurney"] == "1"){
				$message_html .= '<p><span style="color: #800000;"><strong>Date et heure de la fin de la MAD: </strong>'.$collected_data["orderdatereturn"].' '.$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].'</span></p>';
				$field_service_description .= '<p><span style="color: #800000;"><strong>'.t('End of Availability Period').': </strong>'.$collected_data["orderdatereturn"].' '.$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].'</span></p>';
			}
			$message_html .= '<p><strong>Lieu de D&eacute;part:</strong> '.htmlentities($collected_data["address_from"], ENT_QUOTES, "UTF-8").'.</p>';
			$field_service_description .= '<p><strong>'.t('Departure Place').':</strong> '.$collected_data["address_from"].'.</p>';
			
			$message_html .= '<p><strong>Lieu d\'Arriv&eacute;e:</strong> '.htmlentities($collected_data["address_to"], ENT_QUOTES, "UTF-8").'.</p>';
			$field_service_description .= '<p><strong>'.t('Arrival Place').':</strong> '.$collected_data["address_to"].'.</p>';
			
			$message_html .= '<p><strong>V&eacute;hicule:</strong> '.$gamme_auto[$collected_data["passengers"]].'</p>';
			$field_service_description .= '<p><strong>'.t('Car Category').':</strong> '.$gamme_auto[$collected_data["passengers"]].'</p>';
			
			if ($collected_data["chseats"]!="0"){
				$message_html .= '<p><span style="color: #800000;"><strong>Si&egrave;ges Enfants :</strong>'.$collected_data["chseats"].'</span>.</p>';
				$field_service_description .= '<p><span style="color: #800000;"><strong>'.t('Child Seats').' :</strong>'.$collected_data["chseats"].'</span>.</p>';
			}
			if ($collected_data["ride_duration_hour"] ==''){
				$collected_data["ride_duration_hour"] = "00 h";
			}
			$message_html .= '<p><strong>Dur&eacute;e de la course:</strong> '.$collected_data["ride_duration_hour"].' '.$collected_data["ride_duration_minute"].'.</p>';
			$field_service_description .= '<p><strong>'.t('Trip Duration').':</strong> '.$collected_data["ride_duration_hour"].' '.$collected_data["ride_duration_minute"].'.</p>';
			
			$message_html .= '<p><strong>Distance &agrave; parcourir:</strong> '.htmlentities($collected_data["ride_distance"], ENT_QUOTES, "UTF-8").'.</p>';
			$message_html .= '<p><strong>Tariff:</strong> '.htmlentities($tariff, ENT_QUOTES, "UTF-8").'.</p>';			
			$field_service_description .= '<p><strong>'.t('Trip length').':</strong> '.$collected_data["ride_distance"].'.</p>';
						
			$message_html .= '<p><strong>T&eacute;l&eacute;phone:</strong> '.$collected_data["telephones"].'</p>';
			
			$message_html .= '
				<p>Vous pouvez contacter le Client pour prospection s\'il n\'a pas effectu&eacute; une commande.</p>
				<p>Cordialement,</p>
				<p>Jefferson\'s VTC Paris</p>';
				
			
			//Désactivé définitivement car relative à l'ancienne méthode de notification
			_notification_mail ($source, $cc, $destination, $sujet,$message_html,null,null);

			
			return (array ("tariff" => $tariff));
		}
		elseif($latitude == 2){
			if ($tariff!= "Aucun tariff n'est trouvé"){

				$source = '';
				$destination = '';
				$cc = '';
				$sujet = 'Nouvelle Réservation en Ligne';
				$message_html = '<p>Bonjour,</p>
<p>Vous avez re&ccedil;u une r&eacute;servation suivant les donn&eacute;es suivantes:</p>';
				$field_service_description = "";
				
				$message_html .= '
<p><strong>Date et heure de dp&eacute;art:</strong> '.$collected_data["orderdate"].' '.$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].'</p>';
				$field_service_description .= '
<p><strong>'.t('Departure').':</strong> '.$collected_data["orderdate"].' '.$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].'</p>';
				

				
				if ($collected_data["returnjurney"] == "1"){
					$message_html .= '<p><span style="color: #800000;"><strong>Date et heure de la fin de la MAD: </strong>'.$collected_data["orderdatereturn"].' '.$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].'</span></p>';
					$field_service_description .= '<p><span style="color: #800000;"><strong>'.t('End of Availability Period').': </strong>'.$collected_data["orderdatereturn"].' '.$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].'</span></p>';
				}
				$message_html .= '<p><strong>Lieu de D&eacute;part:</strong> '.htmlentities($collected_data["address_from"], ENT_QUOTES, "UTF-8").'.</p>';
				$field_service_description .= '<p><strong>'.t('Departure Place').':</strong> '.$collected_data["address_from"].'.</p>';
				
				if(isset($collected_data["station"]) and $collected_data["station"]!=""){
					$message_html .= '<p><strong>'.t('Flight/Train').':</strong> '.htmlentities($collected_data["station"], ENT_QUOTES, "UTF-8").'.</p>';
					$field_service_description .= '<p><strong>'.t('Flight/Train').':</strong> '.$collected_data["station"].'.</p>';

				}
			
				$message_html .= '<p><strong>Lieu d\'Arriv&eacute;e:</strong> '.htmlentities($collected_data["address_to"], ENT_QUOTES, "UTF-8").'.</p>';
				$field_service_description .= '<p><strong>'.t('Arrival Place').':</strong> '.$collected_data["address_to"].'.</p>';
				
				$message_html .= '<p><strong>V&eacute;hicule:</strong> '.$gamme_auto[$collected_data["passengers"]].'</p>';
				$field_service_description .= '<p><strong>'.t('Car Category').':</strong> '.$gamme_auto[$collected_data["passengers"]].'</p>';
				
				if ($collected_data["chseats"]!="0"){
					$message_html .= '<p><span style="color: #800000;"><strong>Si&egrave;ges Enfants :</strong>'.$collected_data["chseats"].'</span>.</p>';
					$field_service_description .= '<p><span style="color: #800000;"><strong>'.t('Child Seats').' :</strong>'.$collected_data["chseats"].'</span>.</p>';
				}
				if ($collected_data["ride_duration_hour"] ==''){
					$collected_data["ride_duration_hour"] = "00 h";
				}
				$message_html .= '<p><strong>Dur&eacute;e de la course:</strong> '.$collected_data["ride_duration_hour"].' '.$collected_data["ride_duration_minute"].'.</p>';
				$field_service_description .= '<p><strong>'.t('Trip Duration').':</strong> '.$collected_data["ride_duration_hour"].' '.$collected_data["ride_duration_minute"].'.</p>';
				
				$message_html .= '<p><strong>Distance &agrave; parcourir:</strong> '.htmlentities($collected_data["ride_distance"], ENT_QUOTES, "UTF-8").'.</p>';
				$field_service_description .= '<p><strong>'.t('Trip length').':</strong> '.$collected_data["ride_distance"].'.</p>';
				
				$message_html .= '<p><strong>T&eacute;l&eacute;phone:</strong> '.$collected_data["telephones"].'</p>';
				
				$message_html .= '
					<p>Veuillez contacter le Client pour confirmation.</p>
					<p>Cordialement,</p>
					<p>Jefferson\'s VTC Paris</p>';
					
				
				//Désactivé définitivement car relative à l'ancienne méthode de notification
				//_notification_mail ($source, $cc, $destination, $sujet,$message_html,null,null);
				
				
				//Création de la commande
				$store_id = 1;
				$this->my_store = \Drupal\commerce_store\Entity\Store::load($store_id);
				$this->cart = \Drupal::service('commerce_cart.cart_provider')->getCart('default',$this->my_store,\Drupal::currentUser());
				if(!$this->cart){
					$this->cart = \Drupal::service('commerce_cart.cart_provider')->createCart('default', $this->my_store);
				}
				else{
					foreach ($this->cart->getItems() as $order_item_toremove) {
						$this->cart->removeItem($order_item_toremove);
					}
					$this->cart->save();
				}
				
				/////////////Copier les informations client vers le billing Profile.
				
				\Drupal::logger('jeffvtc')->notice('VtcController.php :'."checking profile");
				$profile = \Drupal\profile\Entity\Profile::create([
					'type' => 'customer',
					'address' => [
						'country_code' => 'FR',
					],
				]);
				$profile->save();
				$this->cart->setBillingProfile($profile);
				//$this->cart->setEmail($this->store->get( 'email'));
				$this->cart->save();
				
				$this->cartManager = \Drupal::service('commerce_cart.cart_manager');
				
				$field_departure_date = date_create($collected_data["orderdate"].' '.$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].':00');
				$field_trip_duration = $collected_data["ride_duration_hour"].' '.$collected_data["ride_duration_minute"];
				
				
				//17: Trajet Paris-Paris: à peaufiner par la suite.
				$variation_list  = \Drupal\commerce_product\Entity\ProductVariation::load("17");
				
				$order_item = \Drupal\commerce_order\Entity\OrderItem::create([
					'type' => 'default',
					'quantity' => 1,
					'purchased_entity' => $variation_list->id()
				]);
				
				//$order_item->set("title", "Customized Order Item Title");
				////$order_item->save();

				
				//$this->cartManager->addOrderItem($this->cart, $order_item);
				

				$field_car_type = $this->cart->get("field_car_type");
				$field_car_type->setValue($collected_data["passengers"]);
				

				if ($collected_data["chseats"]!="0"){
					//$this->cart->set("field_children_seats", array(array("value"=>$collected_data["chseats"])));	
					$field_children_seats = $this->cart->get("field_children_seats");
					$field_children_seats->setValue($collected_data["chseats"]);
				}				
				

				$orderdate = date ("Y-m-d",strtotime ($collected_data["orderdate"]));
				
				//Date conversion from Europe/Paris time zone to UTC				
				date_default_timezone_set('Europe/Paris');
				$the_date = strtotime($orderdate." ".$collected_data["selPtHr1"].':'.$collected_data["selPtMn1"].':00');
				//date_default_timezone_set("UTC");
				$orderdate_utc = date("Y-m-d\TH:i:s", $the_date);
				$this->cart->set("field_departure_date", $orderdate_utc);	
				////////////////////////////


				
				$this->cart->set("field_destination", $collected_data["address_to"]);
				$this->cart->set("field_frorm", $collected_data["address_from"]);
				if ($collected_data["returnjurney"] == "1"){					
					//$this->cart->set("field_mad_end_date", $collected_data["orderdatereturn"].' '.$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].':00');

					$orderdatereturn = date ("Y-m-d",strtotime ($collected_data["orderdatereturn"]));		
					//Date conversion from Europe/Paris time zone to UTC				
					date_default_timezone_set('Europe/Paris');
					$the_date = strtotime($orderdatereturn." ".$collected_data["selPtHr2"].':'.$collected_data["selPtMn2"].':00');
					date_default_timezone_set("UTC");
					$orderdatereturn_utc = date("Y-m-d\TH:i:s", $the_date);
					$this->cart->set("field_mad_end_date", $orderdatereturn_utc);	
					////////////////////////////					
				}				
				
				$this->cart->set("field_telephone", $collected_data["telephones"]);
				$this->cart->set("field_trip_distance", $collected_data["ride_distance"]);
				$this->cart->set("field_trip_duration", $collected_data["ride_duration_hour"].':'.$collected_data["ride_duration_minute"]);
				if(isset($collected_data["station"])){
					$this->cart->set("field_train", $collected_data["station"]);					
				}
				else{
					$this->cart->set("field_train", "");
				}

				
				//Overwride the product price	
				$unit_tariff  = str_replace ( "€" , "" , $tariff );
				//$unit_tariff =  (string) ($unit_tariff/10);
				$unit_price = new \Drupal\commerce_price\Price($unit_tariff, 'EUR');
				$order_item->setUnitPrice($unit_price,TRUE);
				$order_item->set("field_service_description",$field_service_description);
				$order_item->field_service_description->format = 'full_html';
				$order_item->save();
				
				$this->cartManager->addOrderItem($this->cart, $order_item);
				ob_start();
				//var_dump("cart_order_item_list");
				//var_dump($cart_order_item_list);
				//var_dump("Cart Created2");
				//var_dump(get_class($field_car_type));
				//var_dump("field_children_seats");
				//$field_children_seats = $this->cart->get("field_children_seats");
				//var_dump($field_children_seats->getValue());
				

				
				//var_dump($orderdate."T".$collected_data["selPtHr1"].':'.$collected_data"selPtMn1"].':00');
				$order_state = $this->cart->getState();
				$order_state_transitions = $order_state->getTransitions();
				//$order_state->applyTransition($order_state_transitions['complete']);

				
				//var_dump($strtotime);
				$cart_id = $this->cart->id();

				
				
				$dumpy = ob_get_clean();
				\Drupal::logger('vtc')->notice('Booking Info: '.$dumpy);
		
				$this->cart->save();


				
				
	
	
				return (array ("reservation_status" => "OK","order" => $cart_id));
			}
			else{
				return (array ("error" => "3"));
			}
		}
		else{
			return (array ("error" => "4"));
		}
		
	}
	public function booking_redirect (){
		//header('Location: /bienvenue#block-gaviasblockbuideraccueil');		
		$language =  \Drupal::languageManager()->getCurrentLanguage()->getId();
		if ($language=="en"){
			return new RedirectResponse('/en/welcome#block-gaviasblockbuiderhomev');
		}
		else{
			return new RedirectResponse('/fr/bienvenue#block-gaviasblockbuideraccueil');
		}
		
	}
	public function showDogInfo($latitude,$longitude) {
		\Drupal::logger('vtc')->notice('Here I am: '.$latitude."___".$longitude);
		$response = new AjaxResponse();
		//$polygon = $this->_get_static_polygon ();
		//$parcours_statique = $polygon ["parcours_statique"];
		//$monuments = $polygon ["monuments"];
		$parcours_statique = array();
		$monuments = array();
		ob_start();
		var_dump("Received infos");
		var_dump($_POST);
		$dumpy = ob_get_clean();
		\Drupal::logger('vtc')->notice('post info: '.$dumpy);
		
		$my_response = $this->_get_price ($_POST , $latitude);
		
		
		/*$my_response = array (
			"parcours_statique" => "Paris", 
			"parcours_actuel" => "Rome",
			"monuments" => "Londre",
		);			*/
		$response->setData($my_response);
		
		return $response;
	}
	public function get_dynamic_points ($order_id){
		$parcours_actuel = array ();
		$order = \Drupal\commerce_order\Entity\Order::load($order_id);

		if ($order->getState()->value == "completed"){
			$field_deplacements = array ();
			$field_deplacements_raw=$order->get('field_deplacements')->getValue();
			if (isset ($field_deplacements_raw[0]["value"])){
				$field_deplacements=json_decode($field_deplacements_raw[0]["value"],true);
				foreach ($field_deplacements as $key => $value){
					$parcours_actuel []= array (
						"long" => $value["long"] , 
						"lat" => $value["lat"],
						"timestamp" => $value["timestamp"],
					);
				}
			}
			//$field_deplacements=json_decode($order->get('field_deplacements')->getValue()[0]["value"],true);
			//$field_deplacements[] = array (
			//	"long" => 10.927223 , 
			//	"lat" => 33.790856,
			//	"timestamp" => time(),
			//);
		}
		return ($parcours_actuel );
	}
	public function ajouter_point($order_id,$latitude=0, $longitude=0, $timestamp=0){
		$order = \Drupal\commerce_order\Entity\Order::load($order_id);

		if ($order->getState()->value == "completed"){
			//$field_deplacements=$order->get('field_deplacements')->getValue()[0]["value"];
			$field_deplacements = array ();
			$field_deplacements_raw=$order->get('field_deplacements')->getValue();
			if (isset ($field_deplacements_raw[0]["value"])){
				$field_deplacements=json_decode($field_deplacements_raw[0]["value"],true);
			}
			//$field_deplacements=json_decode($order->get('field_deplacements')->getValue()[0]["value"],true);
			if ($longitude  !=0){
				if ($timestamp ==0 ){
					$field_deplacements[] = array (
						"long" => $longitude , 
						"lat" => $latitude,
						"timestamp" => time(),
					);					
				}
				else{
					$field_deplacements[] = array (
						"long" => $longitude , 
						"lat" => $latitude,
						"timestamp" => date("H:i",$timestamp),
					);										
				}
				
			}

			$field_deplacements= json_encode($field_deplacements);
			//Start from here
			//$field_deplacements .= " "."Senkouh";
			$order->set("field_deplacements", $field_deplacements);
			//$field_deplacements2=$order->get('field_deplacements')->getValue()[0]["value"];

		//ob_start();
		//var_dump("field_deplacements2");
		//var_dump($field_deplacements2);
		//$dumpy = ob_get_clean();
		//\Drupal::logger('velo')->notice('Deplacements: '.$dumpy);
		
			
			$order->save();
		}
		return array(
		  '#type' => 'markup',
		  '#markup' => 	'merci'
		);			
		
	}
	
	public function _get_static_polygon($tour_variation_id){
		ob_start();
		//$tour_variation_id = 12;
		$parcours_statique = array ();		
		$monuments =  array ();
		
		$variation = \Drupal\commerce_product\Entity\ProductVariation::load($tour_variation_id );
		if ( $variation->isActive()){//Article Actifs
			//var_dump ($variation->get('field_booking_priority')->getValue()[0]["value"]);
			$monument_list = $variation->get('field_monuments')->getValue();
			$step = 1;
			foreach ($monument_list as $key => $value){
				$monument_info = \Drupal\field_collection\Entity\FieldCollectionItem::load($value ["value"]);
				$parcours_statique [] = array (
					"long" => $monument_info->get('field_longitude')->getValue()[0]["value"] , 
					"lat" => $monument_info->get('field_latitude')->getValue()[0]["value"]
				);
				$field_description = $monument_info->get('field_description')->getValue();
				$field_icon = $monument_info->get('field_icon')->getValue();
				if (isset ($field_description[0]["value"])){
					$monuments [] = array (
						"long" => $monument_info->get('field_longitude')->getValue()[0]["value"] , 
						"lat" => $monument_info->get('field_latitude')->getValue()[0]["value"],
						"step" =>  $step, 
						"activity" =>  substr ( strip_tags($field_description[0]["value"]), 0 , 10 )."...",
						"favColor" => $field_icon[0]["value"],
						"align" => "cm", 
						"comment" => $field_description[0]["value"],
						 
					);
					$step ++;
				}
				
			}
			var_dump ("Parcours statique");
			var_dump ($parcours_statique);
			
			var_dump ("Monuments");
			var_dump ($monuments);			
			//var_dump ($variation->get('field_monuments')->getValue()[0] ["value"]);			 	
		}
		//ob_start();
		//var_dump($item_list);
		//var_dump("item_list apres");
		//var_dump("available_ressources");
		//var_dump($output);
		$dumpy = ob_get_clean();
		\Drupal::logger('vtc')->notice('Tour Variation Info:'.$dumpy);
		
		return (
			array (
				"parcours_statique" => $parcours_statique ,
				"monuments" => $monuments,
			)
		);
	}
  
	public function dbb_debug (){

		//return array(
		//  '#type' => 'markup',
		//  '#markup' => 	'merci'
		//);			
		
		return array(
		  '#type' => 'markup',
		  '#markup' => 
			'<div id="map" class="smallmap"></div>
			<div><p id="ajaxdemo"></p></div>'
		);			
	}
	
	public function chache1 (){
	
		global $user;		
		$product_id = 1;
		// Create the new order in checkout; you might also check first to
		// see if your user already has an order to use instead of a new one.
			
		$product = \Drupal\commerce_product\Entity\Product::load('4');
		$variations = $product->getVariations();
		$variation_red_medium = reset($variations );
		
		$order_item = \Drupal\commerce_order\Entity\OrderItem::create([
			'type' => 'default',
			'purchased_entity' => $variation_red_medium,
			'quantity' => 3,
			'unit_price' => $variation_red_medium->getPrice(),
		]);
		$order_item->save();
	
		// You can set the quantity with setQuantity.
		//$order_item->setQuantity('1');
//		$order_item->save();
	
		// You can also set the price with setUnitPrice.
		//$unit_price = new \Drupal\commerce_price\Price('9.99', 'USD');
		//$order_item->setUnitPrice($unit_price);
		//$order_item->save();		

		//$profile = \Drupal\profile\Entity\Profile::create([
		//	'type' => 'customer',
		//	'uid' => 1,
		//]);
		//$profile->save();
		$user = \Drupal::currentUser();
	
		// Next, we create the order.
		$order = \Drupal\commerce_order\Entity\Order::create([
			'type' => 'default',
			'state' => 'draft',
			'mail' => 'user@example.com',
			//'uid' => 1,
			'uid' => $user->id(),
			'ip_address' => '127.0.0.1',
			'order_number' => '8',
			//'billing_profile' => $profile,
			'store_id' => '1',			
			'order_items' => [$order_item],
			'placed' => time(),
		]);
		$order->save();
		
	}
	
	//public function check_availability ($varation_bundle, $date_debut,$date_fin,$quantity,$parameter){
	//			
	//	//$date_debut = "2018-07-08";
	//	//$date_fin = "2018-07-10";
	//	//$quantity = 1;
	//	$error_list = array();
	//	if (isset ($parameter['ressource_category'])){
	//		$ressource_category = $parameter['ressource_category'];
	//	}
	//	else{
	//		$ressource_category = -1;
	//	}
	//	
	//	
    //
	//	$order_dates_list = array ();
	//	$item_list = array();
	//	$item_list_ids = array();
	//	$error = "";
	//			
	//	$varaition_entity = 'commerce_product_variation';
	//	//$varation_bundle = 'guide';//velo	guide	telephone
	//	$output =  array();
	//	
	//	ob_start();
    //
	//	$query = \Drupal::entityQuery($varaition_entity)
	//	//->condition('type', $varation_bundle);
	//	->condition('type', $varation_bundle);
	//	
	//	$vid = $query->execute();
	//	//Rechercher les articles
	//	$product_list = array();
	//	var_dump ("Count raw results");
	//	var_dump (count ($vid));
	//	foreach ($vid as $key => $value){
	//		$variation = \Drupal\commerce_product\Entity\ProductVariation::load($value);
	//		var_dump ("Confg");
	//		//var_dump ($ressource_category);
	//		//var_dump ($variation->get('field_category')->getValue()[0]["value"]);
	//		var_dump ($varation_bundle );
	//		
	//		if ( $variation->isActive()//Article Actifs
	//			and (
	//				(	$varation_bundle == 'velo' and 
	//					$variation->get('field_category')->getValue()[0]["value"] == $ressource_category
	//				)					
	//				or
	//				($varation_bundle == 'telephone')
	//				or 
	//				($varation_bundle == 'guide')
	//				or 
	//				($varation_bundle == 'insurance')
	//			)
	//		)
	//		{
	//			$unavailabilities = $variation->get('field_unavailability')->getValue();
	//			if (!isset($item_list [$variation->id()])){//Construction de l'article
	//				//$item_list [$variation->getSku()] = array (
	//				$item_list [$variation->id()] = array (					
	//					'unavailabilities'=> array(),
	//					'field_booking_priority'=> $variation->get('field_booking_priority')->getValue()[0]["value"],
	//				);
	//			}
	//					
	//			foreach ($unavailabilities as $key_unv => $value_unv){
	//				//$item_list [$variation->getSku()]['unavailabilities'][] = 
	//				$item_list [$variation->id()]['unavailabilities'][] = 
	//				array(
	//					'value' => $value_unv["value"], 
	//					'end_value' => $value_unv["end_value"]
	//				);
	//			}
	//		}
	//	}	
	//	var_dump ("item_list avant");
	//	var_dump ($item_list);
    //
	//	$entity_type = 'commerce_order';
	//	$entity_bundle = 'default';
	//	
	//	$query = \Drupal::entityQuery($entity_type)
	//		->condition('type', $entity_bundle);
	//		
	//	$vid = $query->execute();
	//	
	//	foreach ($vid as $key => $value){
	//		$order = \Drupal\commerce_order\Entity\Order::load($value);
    //
	//		if ($order->getState()->value == "completed"){
	//			$item_list_ids = $order->getItems();
	//			foreach ($item_list_ids as $key_it => $value_it){
	//				if ($value_it->getPurchasedEntity()->bundle() ==$varation_bundle and 
	//				isset($item_list [$value_it->getPurchasedEntity()->id()])){
	//					//if (!isset($item_list [$value_it->getPurchasedEntity()->getSku()])){
	//					//	$item_list [$value_it->getPurchasedEntity()->getSku()] = array (
	//					//		'unavailabilities'=> array(),
	//					//		'field_booking_priority'=> $value_it->getPurchasedEntity()->get('field_booking_priority')->getValue()[0]["value"]
	//					//	);
	//					//}
	//					$item_list [$value_it->getPurchasedEntity()->id()]['unavailabilities'][]=						
	//						array(
	//							'value' => $order->get('field_check_in')->getValue()[0]["value"], 
	//							'end_value' => $order->get('field_check_out')->getValue()[0]["value"]
	//						);
	//					break;			
	//				}
	//			}
	//		}
	//	}
	//	
	//	
	//	//Comparaison des dates
	//	$available_ressources = array ();
	//	foreach ($item_list as $key_list => $value_list){
	//		$ressource_availability = true;
	//		foreach ($value_list ['unavailabilities']as $key_l => $value_l){
	//			if ($varation_bundle !="insurance" and  !($date_fin < $value_l['value'] or $date_debut > $value_l['end_value'])){
	//				$ressource_availability = false;
	//				$error .= '('.$value_l['value'].' to '.$value_l['end_value'].')';
	//				break;
	//			}
	//		}
	//		if ($ressource_availability){
	//			$available_ressources [$key_list] = $value_list ['field_booking_priority'];
	//		}
	//	}
	//	
	//	
	//	//Trier les ressources suivant la priorité
	//	asort ($available_ressources);
	//	$available_ressources =  array_reverse ( $available_ressources, true);		
	//	if (count ($available_ressources) >= $quantity){
	//		$i=0;
	//		foreach ($available_ressources as $key_ress => $value_ress){
	//			$output [$key_ress] = $value_ress;
	//			$i++;
	//			if ($i == $quantity){
	//				$error = "";
	//				break;
	//			}
	//		}
	//	}
	//	else{
	//		$error = "No available ".$varation_bundle." found for that period :".$error; 
	//		$error .= implode  (',',$available_ressources).'|'.$quantity;
	//		$error_list [] = $error;
	//		var_dump ("error");
	//		var_dump ($error);
	//	}
	//		
	//	//var_dump("item_list_ids");
	//	//var_dump($item_list_ids);
	//	var_dump("item_list apres");
	//	var_dump($item_list);
	//	var_dump("error_list");
	//	var_dump($error_list);		
	//	var_dump("available_ressources");
	//	var_dump($output);
	//	var_dump("Dates");
	//	var_dump($date_debut);
	//	var_dump($date_fin);
	//	
	//	//var_dump($order_dates_list);		
	//	$dumpy = ob_get_clean();
	//	\Drupal::logger('vtc')->notice('Booking Purchased Items:'.$dumpy);
	//	
	//	return (array ('output' => $output, 'error' => implode (' ', $error_list)));
    //
	//	//return array(
	//	//  '#type' => 'markup',
	//	//  '#markup' => 
	//	//	"Action is Done"
	//	//);			
	//}	
	function _generation_pdf($order) {

		date_default_timezone_set('Europe/Paris');
		

		//$date = mktime(12, 0, 0, $date['month'], $date['day'], $date['year']);
		//Drupal\parfum\Controller\PDF
		//$pdf = new PDF();
		$pdf = new PDF\PDF;
		//$pdf = new PDF('L');
		$pdf->AliasNbPages();
		$pdf->AddPage();
		$pdf->SetLineWidth(0.05);
		
		$pdf->Image('sites/default/files/logo_transparent.png', 0, 0, 200);
		$pdf->Image('sites/default/files/logo_pdf_171_84.png', 5, 5);
		
		//logo_pdf.png	300px × 84px
		$pdf->SetFont('arial', 'B', 12);
		//$pdf->SetTextColor(163, 2, 7);
		$pdf->SetTextColor(0, 153, 204);
		$pdf->Text(130, 15, utf8_decode($order ['nature'].' n°: '. $order ['id']));
		$pdf->SetTextColor(0, 0, 0);
		
		$pdf->Text(155, 28, utf8_decode('Paris le '.date('d/m/Y',strtotime($order ['order_time'])).',' ));
		 
		$pdf->SetFont('arial', '', 10);
		//start from here http://www.fpdf.org/en/script/script92.php		
		//$pdf->Text(23, 50, utf8_decode('Rapport de Visite Chaufferie et Station - Relevé du '.date('d/m/Y', $node->created) ));	
		$pdf->Text(5, 35, utf8_decode('Émetteur'));	
		$pdf->SetFillColor(230,230,230);
		//$pdf->Rect(5,37,82,45,'FD');//45 + 37 = 82
		$pdf->Rect(5,37,82,53,'FD');//
		$pdf->SetFont('arial', 'B', 12);
		//$pdf->SetXY(5, 39);
		$pdf->Text(7, 42, utf8_decode('JEFFERSON\'S VTC PARIS'));	
		$pdf->SetFont('arial', '', 12);
		$pdf->Text(7, 48, utf8_decode('5 rue de la roseraie'));	
		$pdf->Text(7, 54, utf8_decode('93600 Aulnay sous bois'));	
		$pdf->SetFont('arial', 'B', 12);
		$pdf->Text(7, 60, utf8_decode('Téléphone :'));
		$pdf->Text(7, 66, utf8_decode('Code Siren :'));	   
		$pdf->SetFont('arial', '', 12);
		$pdf->Text(32, 60, utf8_decode('06 99 88 47 65'));	
		$pdf->Text(9, 72, utf8_decode(' 829101757'));
		
		//100
		//171/4=42
		$pdf->Image('sites/default/files/logo_fb_42.png', 7, 76);
		$pdf->Text(15, 80, utf8_decode('Jeffvtcp'));
		$pdf->Image('sites/default/files/logo_instgrm_42.png', 7, 82);
		$pdf->Text(15, 87, utf8_decode('Jeffvtcp'));
		
										

		$pdf->SetFillColor(255,255,255);
		
		
		$pdf->SetFont('arial', '', 10);
		$pdf->Text(112, 35, utf8_decode('Adressée à'));	
		$pdf->Rect(112,37,85,53);
		$pdf->SetFont('arial', 'B', 12);
		$pdf->Text(114, 42, utf8_decode('Client:' ));
		$pdf->Text(114, 48, utf8_decode('Forme Juridique:' ));
		$pdf->Text(114, 54, utf8_decode('Téléphone:' ));		
		$pdf->Text(114, 60, utf8_decode('Adresse:' ));
		

		$pdf->SetFont('arial', '', 12);
		$pdf->Text(129, 42, utf8_decode($order ['nom_client']));
		if (isset($order['organization'])){
			$pdf->Text(150, 48, utf8_decode('Ets '.$order['organization']));
		}
		else{
			$pdf->Text(150, 48, utf8_decode('Client Particulier'));
		}
				
		
		ob_start();
		var_dump($order);
		$dumpy = ob_get_clean();
		\Drupal::logger('vtc')->notice('VtcController.php:'.$dumpy);
		
		
		$pdf->Text(150, 54, utf8_decode($order ['telephone']));	
		
		
		$initial_address_line =  66;
		foreach ($order ['adresse_client'] as $key_a => $value_a){
			$pdf->Text(114, $initial_address_line, utf8_decode(' '.$value_a));
			$initial_address_line += 6;
		}
		
				
		
		$pdf->SetFont('arial', '', 10);
		$pdf->Text(159, 100, utf8_decode('Montants exprimés en '.$order['currency']));
		$pdf->SetFont('arial', '', 12);
		
		
		$pdf->SetXY(5, 102);
		
		//$pdf->MultiCell(170, 10, utf8_decode("Suite à notre visite à votre usine le ").date ('d/m/Y').utf8_decode(", nous avons effectué des analyses d'eau concernant la chaufferie.Vous trouverez ci-dessous les valeurs mesurées le jour de notre visite ainsi que nos recommandations."),0);
		
		/*$pdf->SetFont('arial', 'BU', 12);
		$pdf->Ln(2);
		$pdf->MultiCell(170, 10, utf8_decode("Relevé des mesures prises:"),0);	*/
		
		// Largeurs des colonnes
		$pdf->SetFillColor(230,230,230);
		//$pdf->SetDrawColor(30,30,30);
		$w = array(35, 100, 25, 19,21);
			
		$header = array(utf8_decode("Code"),utf8_decode("Désignation"), utf8_decode("P.U."), utf8_decode("Courses"),utf8_decode("Total TTC"));
		// En-tête
		for($i=0;$i<count($header);$i++){
			$pdf->Cell($w[$i],7,$header[$i],1,0,'C',true);
		}
		$pdf->Ln();
		
		
		//Code|Designation|PUHT|Qte|TotalHT
		
		
		 
		//$pdf->SetXY(5, 122);
		


		//if (isset ($node->field_presentation_pdf['und'])){//We will draw the taken paramters.
		if (isset ($order['lines'])){//We will draw the taken paramters.
			foreach ($order['lines'] as $key_l=> $value_l){
				$parameter_list = explode ('|',$value_l);
				$pdf->SetX(5);
				/*if (count ($parameter_list)==2){//we have here a section
					$pdf->SetFont('arial', 'B', 12);
					$pdf->Cell(10,7,$parameter_list[0],1,0,'C',false);
					$pdf->Cell(175,7,utf8_decode($parameter_list[1]),1,0,'L',false);
					$pdf->Ln();
				}*/
				//elseif (count ($parameter_list)==5){
				if (count ($parameter_list)==5){
								/*ob_start();
			var_dump(count ($parameter_list));
			$dumpy = ob_get_clean();
			\Drupal::logger('parfum')->notice('Le nombre de paramètres est :'.$dumpy);*/

			
					//$parameter_data =  array("1","Température (T)", "50 °C", "<60","Valeur conforme.");
					$pdf->SetFont('arial', '', 12);
					
					for($i=0;$i<count($parameter_list);$i++){
						if ($i==2 or $i==3 or $i==4 ){
							$pdf->Cell($w[$i],7,utf8_decode($parameter_list[$i]),0,0,'R',false);
						}
						elseif ($i==1){
							$current_position = array ($pdf->GetX() ,$pdf->GetY());							
							//$pdf->SetXY(80,80);
							//$pdf->WriteHTML(utf8_decode($parameter_list[$i]));
							
							$pdf->WriteHTML($parameter_list[$i]);
							
							$pdf->SetXY($current_position[0] + $w[$i],$current_position[1]);
						}
						else{
							$pdf->Cell($w[$i],7,utf8_decode('  '.$parameter_list[$i]),0,0,'L',false);
						}
					}
					$pdf->Ln();
				}
			}
			
			//$w_totaux = array ('Sous Total H.T','Frais de Port H.T', 'TOTAL H.T');
			$w_totaux = array ('Net TTC');
			$w_fillcolor = array (255,248,230);
			
			//for ($j=0;$j<3;$j++){
			for ($j=0;$j<1;$j++){
				
				//if ($j==2){//Juste avant le total ht on mettra la mention.
				//	$pdf->SetFillColor(255,255,255);
				//	$pdf->SetX(60);
				//	$pdf->Cell(75,7,utf8_decode("TVA non applicable,article 293 B du CGI."),0,0,'L','F');
				//}
				/*else{
					$pdf->SetX(140);
				}*/
				$pdf->SetX(140);
				$pdf->SetFillColor($w_fillcolor[$j],$w_fillcolor[$j],$w_fillcolor[$j]);
				/*$pdf->Cell(30,7,utf8_decode($w_totaux[$j]),0,0,'L','F');
				$pdf->Cell(35,7,utf8_decode($order [$w_totaux[$j]]),0,0,'R','F');*/
				$pdf->Cell(35,7,utf8_decode($w_totaux[$j]),0,0,'L','F');
				$pdf->Cell(30,7,utf8_decode($order [$w_totaux[$j]]),0,0,'R','F');
				$pdf->Ln();				

			}
			$table_height = 7 * count($order['lines']);
			
			$pdf->Rect(5,109,200,$table_height);
			$starting_position = 5;
			for($i=0;$i<count($header);$i++){
				$pdf->Rect($starting_position,109,$w[$i],$table_height);
				$starting_position += $w[$i];
			}
			/*$w = array(35, 100, 25, 20,20);
			$pdf->Rect(5,109,200,$table_height);*/
		}
		
		/*if (isset($order['sum'])){
			foreach ($order['sum'] as $key_l=> $value_l){
				$parameter_list = explode ('|',$value_l);
				if (count ($parameter_list)==2){
					
				}
				$pdf->SetFont('arial', 'B', 12);
				$pdf->Cell(10,7,$parameter_list[0],1,0,'C',false);
				$pdf->Cell(175,7,utf8_decode($parameter_list[1]),1,0,'L',false);
				$pdf->Ln();				
			}
		}*/
		
		$pdf->Ln();
		$pdf->SetFont('arial', '', 12);

		$pdf->SetXY(5,$pdf->GetY() + 5);
		if ($order ['payment_method'] == "bon_de_commande"){
			$pdf->WriteHTML(utf8_decode("<b><u>Paiement</u>: </b>à bord du véhicule."));
		}
		elseif ($order ['payment_method']== "buziness"){
			$pdf->WriteHTML(utf8_decode("<b><u>Paiement</u>: </b>par bon de commande."));
		}
		else{
			$pdf->WriteHTML(utf8_decode("<b><u>Paiement</u>: </b>déjà effectué en ligne."));
		}
		
		
		
		//$pdf->MultiCell(190, 5, utf8_decode($order ['message']),0);
		//$pdf->SetXY(5,160);
		$pdf->SetXY(5,$pdf->GetY() + 10);
		$pdf->WriteHTML(utf8_decode($order ['field_service_description']));
		
		$pdf->SetXY(5,$pdf->GetY() + 10);
		$pdf->WriteHTML(utf8_decode($order ['message']));
		//$pdf->WriteHTML($order ['message']);
		$pdf->Ln();
		
		//$pdf->WriteHTML(utf8_decode($node->body['und'][0]['value']));
		
		$pdf->Ln();
		$pdf->Ln();
		
		
		

		//$file_name = "AE_" . ucfirst($societe_user->name).'_'.date ('d-m-Y', strtotime($node->field_period['und'][0]['value'])) . ".pdf";
		$file_name = $order ['file_name'];
		
		
		
		$file_path = 'sites/default/files/private/'.$order ['subdirectory'].'/'.$file_name;
		//$file_path = $file_name;
		
		$pdf->Output($file_path, "F");
			
		$file = file_save_data(file_get_contents($file_path), 'private://'.$order ['subdirectory'].'/'.$file_name,FILE_EXISTS_REPLACE );
		 
		
		$order_ui = \Drupal\commerce_order\Entity\Order::load($order ['uid']);
		//$order->get('field_facture')->setValue(set('target_id',$file->id());
		//$order_ui->get('field_facture')->set('target_id',$file->id());
		//$order->get('field_facture')->setValue('target_id');
		//$order->set("field_facture", new \Drupal\commerce_price\Price(strval ($value['PVR']), 'EUR'));
		//$order->set("field_facture", $file->id());
		//$order_ui->get('field_facture')->setValue('target_id');
		$order_ui->get('field_'.$order ['subdirectory'])->setValue($file->id());
		$order_ui->save();
		
		//$file->display = 1;
		//$file->uid = $node->uid;		
		//$node->field_rapport['und'][0] = (array)$file;
		
		return array(
		  '#type' => 'markup',
		  '#markup' => 'La facture est générée',
		);
		
	}
}

