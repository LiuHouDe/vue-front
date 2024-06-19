<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>

    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axiosApi from '@/plugins/axiosConfig.js';
const props = defineProps({
    address: {
        type: String,
        default: null
    },
    cinemaId: {
        type: Number,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    }
});
const mapContainer = ref(null);
const newAddress = ref('');
let map = null;
let marker = null;

const apiKey = import.meta.env.API_KEY;
const mapId = 'b64b6261b917ae52'
const initMap = () => {
    if (mapContainer.value && google && google.maps) {
        map = new google.maps.Map(mapContainer.value, {
            center: { lat: 25.0330, lng: 121.5654 },
            zoom: 12,
            mapId: mapId
        });
    }
};

const geocodeAddress = (address) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                map.setCenter(results[0].geometry.location);
                if (marker) marker.setMap(null);  // Remove existing marker
                marker = new google.maps.Marker({
                    map,
                    position: results[0].geometry.location
                });
            } else {
                console.error('No results found');
            }
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
};
const geocodeNewAddress = () => {
    if (newAddress.value) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: newAddress.value }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    map.setCenter(results[0].geometry.location);
                    if (marker) marker.map = null; // Remove existing marker
                    marker = new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: results[0].geometry.location
                    });
                } else {
                    console.error('No results found');
                }
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
};
const saveNewAddress = () => {
    if (newAddress.value) {
        geocodeAddress(newAddress.value);
        const data = {
            cinema_id: props.cinemaId,
            name: props.name,
            phone: props.phone,
            address: newAddress.value,
        }
        console.log(data)
        axiosApi.post('/admin/backstage/updateCinemaAddress', data)
            .then(response => {
                console.log('Address updated successfully', response);
            })
            .catch(error => {
                console.error('Failed to update address', error);
            });
    }
};

watch(() => props.address, (newAddress) => {
    if (newAddress) {
        geocodeAddress(newAddress);
    }
});

onMounted(async () => {
    try {
        await loadGoogleMaps(apiKey);
        initMap();
    } catch (error) {
        console.error('Failed to load Google Maps API', error);
    }
});
async function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
            resolve(google);
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (typeof google !== 'undefined' && google.maps) {
                resolve(google);
            } else {
                reject(new Error('Google Maps API failed to load.'));
            }
        };
        script.onerror = () => reject(new Error('Google Maps API failed to load.'));
        document.head.appendChild(script);
    });
}
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
}
</style>