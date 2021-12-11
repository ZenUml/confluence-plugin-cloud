There is still a chance that we failed to detect the clone of a macro. This is because the REST
API returns stale data if the operation is too fast. 10 seconds is a reasonable time to that
prevents the issue from happening again.