# Assumptions:

## Network Connectivity

Fare readers on buses are assumed to operate without network connectivity. The system should continue to operate seamlessly for bus journeys and update transactions once connectivity is restored.

## Security

The focus lies on deployment and architecture rather than on security mechanisms like authentication or encryption. Therefore, a recognized limitation of this system would be the absence of fraud detection, which necessitates the implementation of authentication mechanisms. For the purpose of this exercise, we assume that the deployment environment is equipped with appropriate security measures.

## Journey Deadline

In most transit systems, indefinite addition of stations to an ongoing journey is typically prohibited. For instance, in Montreal, this window is set at 2 hours. However, considering the scope of this exercise, we assume that users are initially charged the full $3.2 at the first station. Subsequent stations will continuously calculate the most relevant fare based on the preceding station.

## Fare specifics

Concerning the fare rule "Any two zones including Zone 1," we interpret this to truly signify "Any two adjacent zones including Zone 1." Failing this interpretation, the "Any three zones" rule would remain inapplicable within a system encompassing three zones.

Regarding the calculation of fares, it's worth noting that the fare rules appear to be quite customized and do not adhere to a discernible pattern that can be universally applied to any number of zones. Consequently, it appears appropriate to implement a function that computes the fare by iteratively evaluating each fare rule in order of priority. While the possibility of discovering a pattern exists, which could potentially lead to rule simplification, it's important to acknowledge that such a pattern is not evident at this time.


# Deployment

## Technologies

Given the requirement for local execution rather than cloud-based deployment, Docker would be employed to ensure compatibility across diverse environments. The deployment strategy encompasses three containers: one for the Frontend, another for the API, and a third for the Database. While the precise technologies are secondary, my personal inclination leans towards ReactJS, NestJS, and Postgres.

## Data

Due to the offline nature of this system, it becomes impractical to store all data within the database. Particularly as each bus maintains its individual instance, preventing synchronization among them. Thus, information concerning stations and fares would be stored within each bus. Procedures would be established to periodically update this information, be it daily, weekly, or monthly as dictated by necessity. Given the relatively infrequent change and static nature of this data, this approach is deemed sufficient. As for user-related information, it would be stored within their transit card. This empowers users to employ their card at any station or bus, with terminals utilizing their internal databases to compute the applicable fee before recording the journey history and user balance onto the card. However, this introduces a security vulnerability, enabling users to potentially manipulate their own data without city supervision. Encrypting the data stored on the card can help mitigate this risk. Alternatively, user authentication could be implemented during each tap-in, and journeys could be logged at the station. Consequently, data from each station could be aggregated periodically (daily, monthly, or annually) for journey analysis. In cases of suspected irregular behavior, users could be contacted, and appropriate measures could be implemented.

# How To Run

```
git clone https://github.com/SamyZarour/fare-card-system
cd fare-card-system
npm install
npm run start
```